require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const Task = require('data.task');
const { compose, map, pick, prop, reduce } = require('ramda');
const express = require('express');

// data Member = {
//   "id": "U023BECGF",
//   "team_id": "T021F9ZE2",
//   "name": "bobby",
//   "deleted": false,
//   "status": null,
//   "color": "9f69e7",
//   "real_name": "Bobby Tables",
//   "tz": "America\/Los_Angeles",
//   "tz_label": "Pacific Daylight Time",
//   "tz_offset": -25200,
//   "profile": {
//     "avatar_hash": "ge3b51ca72de",
//     "first_name": "Bobby",
//     "last_name": "Tables",
//     "real_name": "Bobby Tables",
//     "email": "bobby@slack.com",
//     "skype": "my-skype-name",
//     "phone": "+1 (123) 456 7890",
//     "image_24": "https:\/\/...",
//     "image_32": "https:\/\/...",
//     "image_48": "https:\/\/...",
//     "image_72": "https:\/\/...",
//     "image_192": "https:\/\/..."
//   },
//   "is_admin": true,
//   "is_owner": true,
//   "has_2fa": false,
//   "has_files": true
// },

// data TruncatedMember = {
//   "email": "bobby@slack.com",
//   "image_24": "https:\/\/...",
//   "image_32": "https:\/\/...",
//   "image_48": "https:\/\/...",
//   "image_72": "https:\/\/...",
//   "image_192": "https:\/\/..."
// }

// imageKeys :: [string]
const imageKeys = [
  'image_24',
  'image_32',
  'image_48',
  'image_72',
  'image_192',
];

// truncateUserObj :: Member -> TruncatedMember
const truncateUserObj = compose(
  pick([...imageKeys, 'email']),
  prop('profile')
);

// listUsers :: token -> Task Error Response
const listUsers = token =>
  new Task((reject, resolve) =>
    fetch(`https://slack.com/api/users.list?token=${token}`)
      .then(res => res.json())
      .then((res) => {
        if (!res.ok) {
          return reject(res.error);
        }
        return resolve(res);
      })
  );


const indexByEmailAddress = reduce((arr, mem) => {
  const { email, ...data } = mem;
  return { ...arr, [email]: data };
}, {});

// transformSlackListResponse :: Response -> [TruncatedMember]
const transformSlackListResponse = compose(
  indexByEmailAddress,
  map(truncateUserObj),
  prop('members')
);

const error = e => console.error(e); // eslint-disable-line
const log = x => console.log(x); // eslint-disable-line

const main = token =>
  listUsers(token)
  .map(transformSlackListResponse)
  .fork(
    (err) => { error('ERROR:', err); },
    (members) => {
      const app = express();
      const PORT = 4567;

      app.get('/:email', (req, res) => {
        const { email } = req.params;
        const member = members[email];

        if (member) { return res.json(member); }

        return res.status(404).send(`${email} Not found`);
      });

      app.listen(PORT, () => log(`Listening on port ${PORT}`));
    }
  );

main(process.env.SLACK_TOKEN);
