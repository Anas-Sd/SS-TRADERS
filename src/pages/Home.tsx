import { Link } from 'react-router-dom'
import { Search, Package, ArrowRight } from 'lucide-react'

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-primary/10 p-4 rounded-3xl inline-block mb-4 shadow-sm">
                <Package className="w-16 h-16 text-primary" />
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                Manage your business <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-600">
                    with complete clarity
                </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                SS Traders provides a streamlined component and part management system. Browse inventory, track conditions, and manage your products all in one premium interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
                <Link
                    to="/items"
                    className="bg-primary text-primary-foreground hover:bg-primary-600 px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                    Browse Items <ArrowRight size={18} />
                </Link>
                <Link
                    to="/search"
                    className="bg-card text-foreground border border-border hover:border-primary/50 hover:bg-secondary/50 px-8 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2"
                >
                    <Search size={18} className="text-muted-foreground" /> Global Search
                </Link>
            </div>
        </div>
    )
}
