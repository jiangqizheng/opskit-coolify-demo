import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  return (
    <main className="demo-page">
      <section className="demo-panel" aria-labelledby="about-title">
        <p className="island-kicker mb-3">delivery contract</p>
        <h1 id="about-title" className="demo-title mb-5">一个小 demo，完整走一遍上线链路。</h1>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-5 text-sm leading-8 text-[var(--sea-ink-soft)]">
            <p className="m-0">项目由 proj-factory 初始化，代码在 GitHub，镜像使用固定 digest，Coolify 只负责北京节点上的运行生命周期。</p>
            <p className="m-0">Cloudflare 使用 proxied CNAME、remote-managed Tunnel ingress 和单域名 308 规则；北京节点上的固定 cloudflared connector 只把流量交给本机 Traefik。这个无状态演练仍然没有数据库。</p>
            <p className="m-0">健康检查走 <a href="/healthz">/healthz</a>，页面和健康响应都不依赖外部业务数据。</p>
          </div>
          <dl className="space-y-4 rounded-2xl border border-[var(--line)] bg-[color-mix(in_oklab,var(--chip-bg)_84%,transparent)] p-5 text-sm">
            <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-3"><dt className="text-[var(--sea-ink-soft)]">Executor</dt><dd className="m-0 font-semibold">Coolify Cloud</dd></div>
            <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-3"><dt className="text-[var(--sea-ink-soft)]">Cell</dt><dd className="m-0 font-semibold">bj-2c8g</dd></div>
            <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-3"><dt className="text-[var(--sea-ink-soft)]">Mode</dt><dd className="m-0 font-semibold">stateless SSR</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[var(--sea-ink-soft)]">State</dt><dd className="m-0 font-semibold text-[var(--palm)]">publicly verified</dd></div>
          </dl>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="demo-button no-underline">返回首页</Link>
          <Link to="/healthz" className="demo-button demo-button-secondary no-underline">打开健康端点</Link>
        </div>
      </section>
    </main>
  )
}
