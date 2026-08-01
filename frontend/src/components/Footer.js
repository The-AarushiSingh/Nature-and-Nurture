import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#14231A] text-white/70 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/images/logo.jpg" alt="Nature & Nurture" className="w-8 h-8 rounded-lg" />
              <span className="text-white font-bold">Nature & Nurture</span>
            </div>
            <p className="text-xs leading-relaxed">
              AI-powered plant discovery, grounded in real data. Built solo as
              a full-stack + AI engineering project.
            </p>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-3">Product</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/explore" className="hover:text-white">Explore Plants</Link></li>
              <li><Link href="/assistant" className="hover:text-white">AI Assistant</Link></li>
              <li><Link href="/plant-id" className="hover:text-white">Plant ID</Link></li>
              <li><Link href="/garden" className="hover:text-white">My Garden</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-3">Features</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/recommendations" className="hover:text-white">Recommendations</Link></li>
              <li><Link href="/diagnosis" className="hover:text-white">Disease Diagnosis</Link></li>
              <li><Link href="/compare" className="hover:text-white">Compare Plants</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-3">About</p>
            <ul className="space-y-2 text-xs">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub Repo</a></li>
              <li><span>Built by Aarushi Singh</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>© 2026 Nature & Nurture. A student project, not a commercial product.</p>
          <p>Made with 🌿 and a 15-day deadline.</p>
        </div>
      </div>
    </footer>
  );
}