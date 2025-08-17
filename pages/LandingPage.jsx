import Box from "../components/LandingComponents/Box"
import Branding from "../components/LandingComponents/Branding"
import Features from "../components/LandingComponents/Features"
import Footer from "../components/LandingComponents/Footer"
import Footer2 from "../components/LandingComponents/Footer2"
import Header from "../components/LandingComponents/Header"
import styles from "../styles/LandingStyles/LandingPage.module.css"
const LandingPage = ( ) => {

  return(
    <div className={styles.main}>
     <Header />
     <Branding />
     <Features />
     <Box />
     <Footer />
    
    </div>
  )
}

export default LandingPage