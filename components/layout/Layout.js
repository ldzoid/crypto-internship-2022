import MainNavigation from './MainNavigation'
import Header from './Header'
import styles from './Layout.module.css'

const Layout = (props) => {

    let title = 'Blank\nCrypto\nInternship'

    return (
        <>
        <div className={styles.container}>
        <MainNavigation />
        <Header title={title}/>
        </div>
        <main className={styles.main}>
        
            {props.children}
        </main>
        
        </>
    )
}

export default Layout