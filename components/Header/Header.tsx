import Link from 'next/link';
import css from '@/components/Header/Header.module.css'

const Header = () => {
    return (
        <header className={css.header}>

            <Link href="/" aria-label="Home">
                NoteHub
            </Link>
            <nav>
                <ul className={css.navigation}>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/">Notes</Link></li>
                </ul>
            </nav>
        </header>
    )
}
export default Header;