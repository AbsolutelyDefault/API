import { google } from 'googleapis';
import JWT from 'jsonwebtoken';
import { User, Board } from '../models';


function createConnection(redirectUri) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri,
  );
}

function getGooglePlusApi(auth) {
  return google.plus({ version: 'v1', auth });
}

function getGoogleUserFromAccessToken(token, redirectUri = '') {
  const auth = createConnection(redirectUri);
  auth.setCredentials({ access_token: token });
  const plus = getGooglePlusApi(auth);
  return plus.people.get({ userId: 'me' });
}

async function getGoogleAccountFromCode(code, redirectUri) {
  const auth = createConnection(redirectUri);
  const data = await auth.getToken(code);
  const { tokens } = data;
  const me = await getGoogleUserFromAccessToken(tokens.access_token);
  return me.data;
}

export async function authentificate(req) {
  const account = await getGoogleAccountFromCode(req.body.code, req.body.redirectUri);
  let user = await User.findOne({ googleId: account.id });
  if (!user) {
    user = new User({
      email: account.emails[0].value,
      googleId: account.id,
      displayName: account.displayName,
      nickname: account.nickname,
    });
    await user.save();
    const board = new Board({
      authorId: user._id,
      columns: [],
    });
    await board.save();
  }
  const authorizationToken = JWT.sign({ mongoId: user._id }, process.env.JWT_SECRET);
  return { authorizationToken };
}

export async function getUserFromReq(req) {
  const { mongoId } = req.parsedToken || JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
  return User.findById(mongoId);
}

export async function authorization(req, res, next) {
  try {
    req.parsedToken = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(403).send(e);
  }
}
