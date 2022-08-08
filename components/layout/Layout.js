import MainNavigation from './MainNavigation'
import Header from './Header'
import styles from './Layout.module.css'

const Layout = (props) => {
    return (
        <>
        <div className={styles.container}>
        <MainNavigation />
        <Header title='Blank Crypto Internship' />
        </div>
        <main className={styles.main}>
        
            {props.children}
        </main>
        
        </>
    )
}

export default Layout