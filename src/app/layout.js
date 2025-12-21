import '../index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import StarBackground from '../components/StarBackground';

export const metadata = {
    title: 'NASA APOD',
    description: 'Astronomy Picture of the Day',
    icons: {
        icon: '/nasa-logo.ico',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <StarBackground />
                {children}
            </body>
        </html>
    );
}
