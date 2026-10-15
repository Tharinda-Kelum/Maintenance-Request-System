import { USER_ROLES } from '../data/mockData.js';

// Temporary local accounts. Replace authenticate() with the backend API call
// when the authentication endpoint is available. Never keep real passwords here.
export const DEMO_ACCOUNTS = [
  { username: 'user', password: 'user', roleKey: 'STAFF' },
  { username: 'deptadmin', password: 'deptadmin', roleKey: 'DEPT_ADMIN' },
  { username: 'technician', password: 'technician', roleKey: 'TECHNICIAN' },
  { username: 'storekeeper', password: 'storekeeper', roleKey: 'STORE_KEEPER' },
  { username: 'admin', password: 'admin', roleKey: 'SUPER_ADMIN' }
];

export const authenticate = async ({ username, password }) => {
  const normalizedUsername = username.trim().toLowerCase();
  const account = DEMO_ACCOUNTS.find(
    (candidate) =>
      candidate.username === normalizedUsername && candidate.password === password
  );

  if (!account) {
    throw new Error('Invalid username or password.');
  }

  const role = USER_ROLES[account.roleKey];

  return {
    user: {
      ...role.defaultUser,
      username: account.username
    },
    roleId: role.id
  };
};

export const changeDemoPassword = async (username, currentPassword, newPassword) => {
  await authenticate({ username, password: currentPassword });
  if (newPassword.length < 8) throw new Error('Use at least 8 characters for your new password.');
  const account = DEMO_ACCOUNTS.find((item) => item.username === username);
  account.password = newPassword;
};
