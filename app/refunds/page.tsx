export default function RefundsPage() {
  return (
    <main className="container-page py-12">
      <article className="prose prose-sm max-w-3xl text-foreground">
        <h1>退款政策</h1>
        <p>最新版本：2026-06-27</p>

        <h2>核心价值</h2>
        <p>
          ZeroCom 的唯一收入就是订阅费。为了让用户放心做出选择，我们提供
          <strong>订阅后 30 天内无理由退款</strong>。
        </p>

        <h2>退款范围</h2>
        <ul>
          <li>月度 Pro（¥29）：订阅后 30 天内可申请全额退款。</li>
          <li>年度 Pro（¥199）：订阅后 30 天内可申请全额退款。</li>
          <li>超过 30 天后，退款将基于剩余天数按比例计算。</li>
        </ul>

        <h2>退款流程</h2>
        <ol>
          <li>进入「我的」 → 「订阅」 → 点击「申请退款」。</li>
          <li>选择退款原因（可选）：未使用 / 误订 / 其他。</li>
          <li>我们将在 5 个工作日内审核，退款返回原支付账户（1–15 个工作日到账）。</li>
        </ol>

        <h2>不收取交易佣金</h2>
        <p>
          ZeroCom 在任何场景下都不会从房产成交价中收取佣金。如您被任何冒充 ZeroCom 的人员
          要求支付佣金，请立即举报。
        </p>
      </article>
    </main>
  );
}
