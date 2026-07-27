import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

const proofPoints = [
  ['源代码', 'PF-managed repo', '可继续开发'],
  ['运行时', 'Coolify Cloud', 'Docker cell'],
  ['节点', 'bj-2c8g', '北京'],
  ['入口', 'coolify-demo.perphq.com', 'Cloudflare Tunnel'],
] as const

function Home() {
  return (
    <main className="demo-page">
      <section className="demo-panel rise-in overflow-hidden" aria-labelledby="hero-title">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="demo-pill"><span className="h-2 w-2 rounded-full bg-emerald-500" />LIVE</span>
              <span className="demo-pill">OpsKit delivery proof</span>
            </div>
            <p className="island-kicker mb-3">A tiny service, a real path to production</p>
            <h1 id="hero-title" className="display-title mb-5 max-w-3xl text-5xl leading-[0.98] font-bold tracking-tight sm:text-7xl">
              Ship the small idea.
              <br />
              <span className="text-[var(--lagoon-deep)]">Keep the path obvious.</span>
            </h1>
            <p className="demo-muted mb-8 max-w-2xl text-base leading-8 sm:text-lg">
              这是一个由 OpsKit 创建、构建并部署的双语 demo。它用最少的运行时证明一条完整链路：代码、不可变镜像、Coolify、北京节点、域名和健康检查。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/healthz" className="demo-button no-underline">查看健康状态</Link>
              <Link to="/about" className="demo-button demo-button-secondary no-underline">查看交付说明</Link>
            </div>
          </div>

          <div className="relative rounded-[1.25rem] border border-[var(--line)] bg-[color-mix(in_oklab,var(--chip-bg)_84%,transparent)] p-5">
            <div className="mb-8 flex items-center justify-between gap-4">
              <span className="island-kicker">delivery snapshot</span>
              <span className="text-xs font-semibold text-[var(--palm)]">verified</span>
            </div>
            <div className="space-y-4">
              {proofPoints.map(([label, value, note]) => (
                <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4 last:border-0 last:pb-0" key={label}>
                  <span className="text-sm text-[var(--sea-ink-soft)]">{label}</span>
                  <span className="text-right">
                    <strong className="block break-all text-sm text-[var(--sea-ink)]">{value}</strong>
                    <small className="text-xs text-[var(--sea-ink-soft)]">{note}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Delivery checks">
        <article className="demo-card rise-in" style={{ animationDelay: '80ms' }}>
          <p className="island-kicker mb-3">01 / build</p>
          <h2 className="demo-section-title mb-2">Immutable artifact</h2>
          <p className="demo-muted m-0 text-sm leading-7">每次发布都绑定一个不可变 OCI digest，运行节点不负责编译。</p>
        </article>
        <article className="demo-card rise-in" style={{ animationDelay: '160ms' }}>
          <p className="island-kicker mb-3">02 / route</p>
          <h2 className="demo-section-title mb-2">One public hostname</h2>
          <p className="demo-muted m-0 text-sm leading-7">Cloudflare Tunnel 把公网流量送到节点本机 Traefik，源站不再依赖北京公网域名入口。</p>
        </article>
        <article className="demo-card rise-in" style={{ animationDelay: '240ms' }}>
          <p className="island-kicker mb-3">03 / prove</p>
          <h2 className="demo-section-title mb-2">Five health signals</h2>
          <p className="demo-muted m-0 text-sm leading-7">进程、传输、就绪、域名和依赖都能被单独观察。</p>
        </article>
      </section>

      <section className="demo-panel mt-8" aria-labelledby="next-title">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="island-kicker mb-2">what this proves</p>
            <h2 id="next-title" className="demo-title">从 demo 到真实项目，只需替换 artifact。</h2>
          </div>
          <a className="demo-button demo-button-secondary no-underline" href="https://github.com/jiangqizheng/opskit-coolify-demo" target="_blank" rel="noreferrer">查看源代码</a>
        </div>
        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="demo-list-item"><strong className="mr-2">本地</strong><span className="demo-muted">PF preview + Playwright</span></div>
          <div className="demo-list-item"><strong className="mr-2">线上</strong><span className="demo-muted">Coolify Cloud + bj-2c8g</span></div>
          <div className="demo-list-item"><strong className="mr-2">域名</strong><span className="demo-muted">proxied CNAME + Tunnel → Traefik</span></div>
          <div className="demo-list-item"><strong className="mr-2">恢复</strong><span className="demo-muted">固定清理合同，不留孤儿资源</span></div>
        </div>
      </section>
    </main>
  )
}
