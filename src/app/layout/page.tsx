import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const Layout = ({ children }:any) => {
  return (
     <div className="layout">
            <Navbar />
            <div className="layout-content">
                {children}
            </div>
            <Footer/>
        </div>
  )
}

export default Layout
