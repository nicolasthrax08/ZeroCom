const users = new Map([
  ['u_free', { id: 'u_free', phone: '13800000000', verificationTier: 'phone_only', subscription: { plan: 'free', active: false } }],
  ['u_paid_t2', { id: 'u_paid_t2', phone: '13900000000', verificationTier: 'phone+ID', subscription: { plan: 'monthly', active: true } }]
]);

export const getById = (id) => users.get(id);
export const upsert = (user) => users.set(user.id, user);
