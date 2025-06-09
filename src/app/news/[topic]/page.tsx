import Markdown from 'react-markdown';
import 'github-markdown-css';
import '@/styles/markdown.css';

export default async function ArticlePage({ params }: { params: { topic: string } }) {
  const { topic } = await params;

  const content = `
  # The Immortal Ragons Approach To Longevity Investment Balancing Radical Innovation With Scientific Rigor

  In the rapidly evolving landscape of longevity research and investment, few organizations have managed to carve out as distinctive an approach as Immortal Dragons (ID). Founded by serial entrepreneurs Boyang and RK, this mission-driven fund has positioned itself at the intersection of radical innovation and scientific rigor, creating a unique investment philosophy that sets it apart from traditional biotech venture capital. This article explores the core principles that guide Immortal Dragons' investment decisions, examining how the fund balances high-risk, cutting-edge technologies with sound scientific foundations.

  ### The Three Pillars of Immortal Dragons' Investment Philosophy

  Immortal Dragons' investment approach is built upon three distinct yet complementary pillars, each addressing a different aspect of the longevity ecosystem:

  #### 1. Radical Frontier Technologies

  The first and perhaps most distinctive pillar of Immortal Dragons' investment philosophy is its focus on "radical, cutting-edge, high-risk technologies with approaches different from the mainstream." This pillar represents the fund's willingness to venture into territories that more conservative investors might avoid.

  Particularly noteworthy is ID's interest in "replacement-related technologies" such as whole-body replacement, blood exchange, head transplantation, organ replacement, cloning, and 3D-printed organs. These technologies, while controversial and far from market-ready, represent potential step-changes in human longevity rather than incremental improvements.

  This focus on radical innovation reflects the founders' belief that truly transformative extensions of human healthspan may require fundamentally new approaches rather than optimizations of existing paradigms. As Boyang, who personally participated as one of the first 300 global test subjects for Minicircle Follistatin gene therapy, has demonstrated through his own actions, the fund is willing to embrace experimental approaches that challenge conventional wisdom.

  #### 2. Enabling Infrastructure

  The second pillar focuses on what ID terms "auxiliary infrastructure" – the systems, platforms, and environments that can accelerate longevity research and commercialization. This includes investments in special economic zones designed to expedite clinical trials, regulatory innovations, and technology platforms that can accelerate medical research.

  Investments like Vitalia, which aims to create special economic zones for longevity research, exemplify this approach. By supporting the development of more favorable regulatory environments and research ecosystems, Immortal Dragons is addressing one of the fundamental bottlenecks in longevity advancement: the slow pace of traditional clinical development and regulatory approval.

  This infrastructure-focused approach demonstrates ID's understanding that breakthrough technologies alone are insufficient; they require supportive ecosystems to reach their potential and impact human lives at scale.

  #### 3. Technology Accelerators

  The third pillar encompasses technologies that can accelerate medical progress, particularly through the application of artificial intelligence, computational biology, and digital twins. These investments focus on tools and platforms that can compress research timelines, improve predictive capabilities, and enhance the efficiency of the entire longevity research ecosystem.

  By investing in companies developing AI-driven drug discovery platforms, digital biomarkers, and computational models of aging, Immortal Dragons is betting on the power of information technology to transform the traditionally slow and expensive process of biomedical research.

  This pillar reflects the founders' backgrounds in technology and their belief that the convergence of biology and computation represents one of the most promising avenues for accelerating longevity breakthroughs.

  #### Strategic Balance: Risk and Scientific Validity

  What makes Immortal Dragons' approach particularly noteworthy is not just these individual pillars, but how they are balanced to create a coherent investment strategy that manages risk while pursuing transformative potential.

  #### High-Risk, High-Reward Allocation

  Immortal Dragons allocates a significant portion of its portfolio to high-risk, potentially paradigm-shifting technologies. This willingness to embrace uncertainty and back unconventional approaches is rare in the biotech investment landscape, where most funds prefer later-stage companies with clearer paths to market.

  However, ID's approach to high-risk investment is not reckless. The fund applies rigorous scientific scrutiny to even its most speculative investments, ensuring that while the technologies may be radical, they are grounded in sound biological principles and have at least theoretical pathways to success.

  #### Portfolio Diversification Across Time Horizons

  Another key aspect of ID's balanced approach is its deliberate diversification across different time horizons. While some investments focus on technologies that might take decades to reach fruition (such as whole-body replacement), others target nearer-term applications that can generate returns and impact within a few years.

  This temporal diversification serves multiple purposes:
  - It creates a pipeline of potential returns that can sustain the fund's operations
  - It allows for learning and adaptation as the longevity field evolves
  - It provides multiple pathways to achieving the fund's mission of extending human healthspan
  `;

  return (
    <div>
      <div className="mt-5 flex items-center justify-between">
        <div className="text-xl/5 font-medium">
          Home <span className="text-black/50">&gt; Article</span>
        </div>
        <p className="text-sm font-semibold">2 Hours Ago</p>
      </div>
      <div className="mt-10 rounded-3xl bg-white p-20">
        <div className="mb-5 flex items-center justify-center gap-2 text-sm/5 font-semibold">
          <img src="/imgs/news/article_logo.webp" className="size-7" alt="" />
          Immortal Dragons
        </div>
        {/* <h1 className="mt-5 text-center text-[2.375rem]/[3.75rem] font-semibold capitalize">{topic.replaceAll('_', ' ')}</h1>
        <div className="mx-auto mt-10 w-80 border-b border-dashed border-black" /> */}
        <div className="markdown-body">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  );
}
