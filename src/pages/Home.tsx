import { Link } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                SS Traders <br />
                <span className="text-primary">
                    Heavy Machinery Dealer in India
                </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                SS Traders is a trusted supplier of heavy machinery, construction equipment, and industrial machines across India. 
                We provide reliable products, competitive pricing, and dedicated customer support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
                <Link
                    to="/items"
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2"
                >
                    View Machinery <ArrowRight size={18} />
                </Link>
                <Link
                    to="/search"
                    className="bg-card border px-8 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2"
                >
                    <Search size={18} /> Search Equipment
                </Link>
            </div>
        </div>
    )
}