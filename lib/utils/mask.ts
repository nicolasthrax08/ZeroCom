export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return '****';
  if (phone.length === 11) return `${phone.slice(0, 3)}****${phone.slice(7)}`;
  return `${phone.slice(0, 2)}****${phone.slice(-3)}`;
}

export function maskWeChat(wechat: string): string {
  if (!wechat || wechat.length < 4) return '****';
  return `${wechat.slice(0, 2)}****${wechat.slice(-2)}`;
}
