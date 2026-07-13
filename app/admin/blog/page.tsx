import { createServerClient } from '@/lib/supabase/server';
import { MarketPostCard } from '@/components/site/market-post-card';
import { EconomicCalendar } from '@/components/site/economic-calendar';
import { NewsFeed } from '@/components/site/news-feed';
import { AdBlock } from '@/components/site/ad-block';
import { EmptyState } from '@/components/site/empty-state';
import { PropFirmCard } from '@/components/site/prop-firm-card';
import Link from 'next/link';
import { TrendingUp, BarChart3, Shield, Zap, ArrowRight, Sparkles } from 'lucide-react';
import type { MarketPost, PropFirm } from '@/lib/types';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createServerClient();

  const [{ data: posts }, { data: featuredFirms }] = await Promise.all([
    supabase
      .from('market_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(10),
    supabase
      .from('prop_firms')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(3),
  ]);

  const marketPosts = (posts as MarketPost[]) || [];
  const firms = (featuredFirms as PropFirm[]) || [];
  const featured = marketPosts[0];
  const rest = marketPosts.slice(1);

  return (
    <div className="bg-radial-glow">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24 relative">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              Global Prop Firm Reviews & Market Intelligence
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] animate-fade-in">
              Find the best{' '}
              <span className="text-primary text-glow-blue">funded trading</span>
              {' '}opportunities worldwide
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl animate-fade-in">
              Compare crypto, CFD, and futures prop firms. Get exclusive coupons,
              read expert reviews, and stay ahead with real-time market analysis.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-in">
              <Link
                href="/prop-firms"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Browse Prop Firms <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/prop-firms/compare"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:border-primary/40 font-medium transition-colors"
              >
                Compare Firms
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {[
                { icon: Shield, label: 'Vetted Firms', value: 'Trusted' },
                { icon: Zap, label: 'Instant Coupons', value: 'Live Deals' },
                { icon: BarChart3, label: 'Market Analysis', value: 'Daily' },
                { icon: TrendingUp, label: 'Global Coverage', value: 'US · UK · EU' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{value}</span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Market posts feed */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Latest Market Analysis</h2>
              <Link href="/market" className="text-sm text-primary hover:underline">View all →</Link>
            </div>

            <div className="mb-6">
              <AdBlock format="banner" />
            </div>

            {marketPosts.length === 0 ? (
              <EmptyState
                title="No posts yet"
                description="Market analysis articles will appear here once published."
                className="border border-border rounded-2xl"
              />
            ) : (
              <>
                {featured && (
                  <div className="mb-6">
                    <MarketPostCard post={featured} featured />
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  {rest.map((post) => (
                    <MarketPostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            )}

            {firms.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Featured Prop Firms</h2>
                  <Link href="/prop-firms" className="text-sm text-primary hover:underline">View all →</Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {firms.map((firm) => (
                    <PropFirmCard key={firm.id} firm={firm} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <NewsFeed limit={8} />
            <EconomicCalendar limit={6} />
            <AdBlock format="sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}
