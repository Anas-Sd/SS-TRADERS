import { useEffect, useState, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search as SearchIcon, Package, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    const inputRef = useRef<HTMLInputElement>(null)

    const [results, setResults] = useState<{ items: any[], parts: any[] }>({ items: [], parts: [] })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const performSearch = async () => {
            if (!query.trim()) {
                setResults({ items: [], parts: [] })
                setLoading(false)
                return
            }
            setLoading(true)

            const { data: itemsData, error: itemsError } = await supabase
                .from('items')
                .select('*')
                .ilike('name', `%${query}%`)

            const { data: partsData, error: partsError } = await supabase
                .from('parts')
                .select(`*, items(name)`)
                .ilike('name', `%${query}%`)

            if (!itemsError && !partsError) {
                setResults({ items: itemsData || [], parts: partsData || [] })
            }

            setLoading(false)
        }

        const debounceTimer = setTimeout(() => {
            performSearch()
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [query])

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
            <div className="mb-8 space-y-5">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                    <SearchIcon className="text-primary w-6 h-6" />
                    Search Registry
                </h1>

                {/* Live Search Input */}
                <div className="relative max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for inventory, items, or parts..."
                        value={query}
                        onChange={(e) => {
                            if (e.target.value) {
                                setSearchParams({ q: e.target.value })
                            } else {
                                setSearchParams({})
                            }
                        }}
                        className="w-full bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl py-3 pl-12 pr-4 text-base outline-none transition-all shadow-sm"
                        autoFocus
                    />
                </div>

                {query && (
                    <p className="text-muted-foreground mt-2">
                        Showing results for <span className="text-foreground font-medium">"{query}"</span>
                    </p>
                )}
            </div>

            {!query && (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
                    <SearchIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">Type to view results</h3>
                    <p className="text-muted-foreground mt-1">Start typing in the bar above to query items and parts.</p>
                </div>
            )}

            {loading && query && (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            {!loading && query && results.items.length === 0 && results.parts.length === 0 && (
                <div className="text-center py-20 bg-card border border-border rounded-xl shadow-sm">
                    <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No results found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your search terms.</p>
                </div>
            )}

            {!loading && query && (results.items.length > 0 || results.parts.length > 0) && (
                <div className="space-y-10 animate-in fade-in">
                    {results.items.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Items</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                {results.items.map(item => (
                                    <Link
                                        key={item.id}
                                        to={`/items/${item.id}`}
                                        className="group bg-card border border-border hover:border-primary/50 p-4 rounded-xl flex items-center justify-between transition-all hover:shadow-md"
                                    >
                                        <span className="font-medium">{item.name}</span>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.parts.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Parts</h2>
                            <div className="grid gap-4">
                                {results.parts.map(part => (
                                    <Link
                                        key={part.id}
                                        to={`/items/${part.item_id}`}
                                        className="group bg-card border border-border hover:border-primary/50 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between transition-all hover:shadow-md gap-4"
                                    >
                                        <div>
                                            <h4 className="font-semibold text-lg">{part.name}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">In item: {part.items?.name}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${parseInt(part.units) === 0 || part.units === '0' || part.units === 0 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary-700 dark:text-primary-300'}`}>
                                                {parseInt(part.units) === 0 || part.units === '0' || part.units === 0 ? 'Out of Stock' : `${part.units} Units`}
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
