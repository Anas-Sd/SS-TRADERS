import { Info } from 'lucide-react'

export default function About() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-primary/10 p-3 rounded-2xl">
                    <Info className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">About SS Traders</h1>
            </div>

            <div className="prose prose-slate dark:prose-invert">
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                    SS Traders is your comprehensive platform for managing business items and parts.
                    Our system is designed with simplicity and power in mind, allowing unauthenticated
                    users to browse all available inventory while providing powerful management tools
                    for authenticated users.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-12 bg-card border border-border p-6 rounded-2xl shadow-sm">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">For Browsers</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Browse through all available items</li>
                            <li>• View detailed part information</li>
                            <li>• See part conditions and quantities</li>
                            <li>• Global and local search functionality</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">For Administrators</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Add and remove items</li>
                            <li>• Manage individual parts</li>
                            <li>• Upload component imagery</li>
                            <li>• Maintain inventory counts securely</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground">
                        <a href="tel:9848125153" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <span className="text-xl">📞</span> 9848125153
                        </a>
                        <a href="mailto:anassd303@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <span className="text-xl">✉️</span> anassd303@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
