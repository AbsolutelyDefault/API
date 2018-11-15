import { google } from 'googleapis';
import { User } from '../models';


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
  return { data: me.data, tokens };
}

export async function authentificate(req) {
  const { data: account, tokens } = await getGoogleAccountFromCode(req.body.code, req.body.redirectUri);
  let user = await User.findOne({ googleId: account.id });
  if (!user) {
    user = new User({
      googleId: account.id,
      displayName: account.displayName,
      nickname: account.nickname,
    });
    await user.save();
  }
  return tokens;
}

export async function getUserFromAccessToken(token) {
  const me = await getGoogleUserFromAccessToken(token);
  const { id: googleId } = me.data;
  return User.findOne({ googleId });
}

export async function authorization(req, res, next) {
  try {
    const user = await getUserFromAccessToken(req.cookies.vueauth_access_token);
    if (!user) {
      throw new Error();
    }
    next();
  } catch (e) {
    res.status(403).send(e);
  }
}
