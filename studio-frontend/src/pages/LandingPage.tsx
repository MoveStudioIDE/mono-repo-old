import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LandingHeader from "../components/LandingHeader";
import hero1 from "../icons/hero1.jpeg";
import dan from "../icons/dan.jpeg";
import buildPage from "../icons/build-page.png";
import deployPage from "../icons/deploy-page.png";
import studioIcon from "../icons/studio-62.png"

const quotes = [
  "Coding, like poetry, should be short and concise",
  "It’s not a bug; it’s an undocumented feature",
  "Code is like humor. When you have to explain it, it’s bad",
  "Clean code always looks like it was written by someone who cares",
  "If, at first, you do not succeed, call it version 1.0",
  "Talk is cheap. Show me the code", 
  // "Confusion is part of programming",
]


function LandingPage() {

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const quote = 


  useEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  
  return (
    <div className="bg-base-300">
      <LandingHeader
        theme={theme}
        setTheme={setTheme}
      />
      <div className="hero min-h-min bg-base-200 w-full shadow-2xl">
        <div className="hero-content flex-row">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Move Studio IDE</h1>
            <p className="py-6">An online IDE built for Sui smart contract development. Built for developers of all experience levels, Move Studio provides developers with essential building tools and resources.</p>
            <a><Link to="/build"><button className="btn btn-primary">Get building</button></Link></a>
          </div>
          <img src={hero1} className="rounded-lg shadow-2xl" style={{height: "400px"}}/>

        </div>
      </div>
      <div className="flex justify-center m-10 w-full">
        <div style={{width: "70%"}}>
          <div className="carousel" >
            <div id="feature-item1" className="carousel-item w-full">
              <div className="card card-compact bg-base-100 shadow-xl">
                <figure className="px-10 pt-10"><img src={buildPage} className="w-full rounded-2xl shadow-2xl" style={{}} /></figure>
                <div className="card-body text-center items-center">
                  <h2 className="card-title">Build</h2>
                  <p>The build page provides an environment to create and work on Sui Move packages. We use the monaco editor and provide Sui Move package compilation. </p>
                </div>
              </div>
            </div> 
            <div id="feature-item2" className="carousel-item w-full">
              <div className="card card-compact bg-base-100 shadow-xl">
                <figure className="px-10 pt-10 "><img src={deployPage} className="w-full rounded-2xl shadow-2xl" style={{}} /></figure>
                <div className="card-body text-center items-center">
                  <h2 className="card-title">Deploy</h2>
                  <p>The deploy page provides an environment to deploy and interact with Sui Move packages and objects. We visualize the Sui objects as well as provide an interface to call Sui Move entry functions. . </p>
                </div>
              </div>            
            </div> 
            {/* <div id="item3" className="carousel-item w-full">
              <div className="card card-compact bg-base-100 shadow-xl">
                <figure className="px-10 pt-10"><img src={buildPage} className="w-full rounded-2xl" style={{}} /></figure>
                <div className="card-body text-center items-center">
                  <h2 className="card-title">Build</h2>
                  <p>Our build page provides an environment to create and work on Sui Move packages. We use the monaco editor and provide Sui Move package compilation. </p>
                </div>
              </div>            
            </div>  */}
            {/* <div id="item4" className="carousel-item w-full">
              <div className="card card-compact bg-base-100 shadow-xl">
                <figure className="px-10 pt-10"><img src={buildPage} className="w-full rounded-2xl" style={{}} /></figure>
                <div className="card-body text-center items-center">
                  <h2 className="card-title">Build</h2>
                  <p>Our build page provides an environment to create and work on Sui Move packages. We use the monaco editor and provide Sui Move package compilation. </p>
                </div>
              </div>            
            </div> */}
          </div> 
          <div className="flex justify-center w-full py-2 gap-2">
            <a href="#feature-item1" className="btn btn-xs">1</a> 
            <a href="#feature-item2" className="btn btn-xs">2</a> 
            {/* <a href="#item3" className="btn btn-xs">3</a>  */}
            {/* <a href="#item4" className="btn btn-xs">4</a> */}
          </div>
        </div>
      </div>
      <div className="hero min-h-min bg-base-200 p-10 ">
        <div className="hero-content flex-row ">
          <div className="card card-side bg-base-100 shadow-xl">
            <figure className="p-5">
              <div>
                <ul className="steps steps-vertical">
                  <li className="step step-success">Basic IDE</li>
                  <li className="step step-warning">Contract wizard + UI improvements</li>
                  <li className="step">Mainnet integration</li>
                  <li className="step">Package/object interaction directory</li>
                </ul>
              </div>
            </figure>
          </div>
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Roadmap</h1>
            <p className="py-6">Now that we have the basic IDE setup, we will be working on looking at feedback from the community, improving the UI, and working on new tools to improve the development experience. </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center m-10">
        <div>
          <div className="carousel w-64 rounded-box">
            <div id="team-item1" className="carousel-item w-full ">
              <div className="card card-compact bg-base-100 shadow-xl" >
                <figure className="px-10 pt-10">
                  <img src={dan} alt="dan" className="rounded-2xl shadow-2xl" />
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">Daniel</h2>
                  <p>Founder & Developer</p>
                </div>
              </div>  
            </div> 
            {/* <div id="item2" className="carousel-item w-full">
              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Card title!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>
            </div>  */}
            {/* <div id="item3" className="carousel-item w-full">
              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Card title!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>
            </div>  */}
            {/* <div id="item4" className="carousel-item w-full">
              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Card title!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>  
          <div className="flex justify-center w-64 py-2 gap-2">
            <a href="#team-item1" className="btn btn-xs">1</a> 
            {/* <a href="#item2" className="btn btn-xs">2</a>  */}
            {/* <a href="#item3" className="btn btn-xs">3</a>  */}
            {/* <a href="#item4" className="btn btn-xs">4</a> */}
          </div>
        </div>   
      </div>
      <footer className="footer items-center p-4 bg-neutral text-neutral-content">
        <div className="items-center grid-flow-col">
          <img src={studioIcon} width="30px" style={{marginRight: "5px"}}/>
          {quotes[Math.floor(Math.random() * quotes.length)]}
        </div> 
        <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a href="https://github.com/MoveStudioIDE/mono-repo" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"></path></svg>
          </a> 
          <a href="https://discord.gg/ep2MXBf9wy" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="24" height="24"viewBox="0 0 24 24" className="fill-current"><path d="M19.98,5.69c-1.68-1.34-4.08-1.71-5.12-1.82h-0.04c-0.16,0-0.31,0.09-0.36,0.24c-0.09,0.23,0.05,0.48,0.28,0.52 c1.17,0.24,2.52,0.66,3.75,1.43c0.25,0.15,0.31,0.49,0.11,0.72c-0.16,0.18-0.43,0.2-0.64,0.08C15.56,5.38,12.58,5.3,12,5.3 S8.44,5.38,6.04,6.86C5.83,6.98,5.56,6.96,5.4,6.78C5.2,6.55,5.26,6.21,5.51,6.06c1.23-0.77,2.58-1.19,3.75-1.43 c0.23-0.04,0.37-0.29,0.28-0.52c-0.05-0.15-0.2-0.24-0.36-0.24H9.14C8.1,3.98,5.7,4.35,4.02,5.69C3.04,6.6,1.09,11.83,1,16.46 c0,0.31,0.08,0.62,0.26,0.87c1.17,1.65,3.71,2.64,5.63,2.78c0.29,0.02,0.57-0.11,0.74-0.35c0.01,0,0.01-0.01,0.02-0.02 c0.35-0.48,0.14-1.16-0.42-1.37c-1.6-0.59-2.42-1.29-2.47-1.34c-0.2-0.18-0.22-0.48-0.05-0.68c0.18-0.2,0.48-0.22,0.68-0.04 c0.03,0.02,2.25,1.91,6.61,1.91s6.58-1.89,6.61-1.91c0.2-0.18,0.5-0.16,0.68,0.04c0.17,0.2,0.15,0.5-0.05,0.68 c-0.05,0.05-0.87,0.75-2.47,1.34c-0.56,0.21-0.77,0.89-0.42,1.37c0.01,0.01,0.01,0.02,0.02,0.02c0.17,0.24,0.45,0.37,0.74,0.35 c1.92-0.14,4.46-1.13,5.63-2.78c0.18-0.25,0.26-0.56,0.26-0.87C22.91,11.83,20.96,6.6,19.98,5.69z M8.89,14.87 c-0.92,0-1.67-0.86-1.67-1.91c0-1.06,0.75-1.92,1.67-1.92c0.93,0,1.67,0.86,1.67,1.92C10.56,14.01,9.82,14.87,8.89,14.87z M15.11,14.87c-0.93,0-1.67-0.86-1.67-1.91c0-1.06,0.74-1.92,1.67-1.92c0.92,0,1.67,0.86,1.67,1.92 C16.78,14.01,16.03,14.87,15.11,14.87z"></path></svg>
          </a>
          <a target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="24" height="24"viewBox="0 0 30 30" className="fill-current"><path d="M28,6.937c-0.957,0.425-1.985,0.711-3.064,0.84c1.102-0.66,1.947-1.705,2.345-2.951c-1.03,0.611-2.172,1.055-3.388,1.295 c-0.973-1.037-2.359-1.685-3.893-1.685c-2.946,0-5.334,2.389-5.334,5.334c0,0.418,0.048,0.826,0.138,1.215 c-4.433-0.222-8.363-2.346-10.995-5.574C3.351,6.199,3.088,7.115,3.088,8.094c0,1.85,0.941,3.483,2.372,4.439 c-0.874-0.028-1.697-0.268-2.416-0.667c0,0.023,0,0.044,0,0.067c0,2.585,1.838,4.741,4.279,5.23 c-0.447,0.122-0.919,0.187-1.406,0.187c-0.343,0-0.678-0.034-1.003-0.095c0.679,2.119,2.649,3.662,4.983,3.705 c-1.825,1.431-4.125,2.284-6.625,2.284c-0.43,0-0.855-0.025-1.273-0.075c2.361,1.513,5.164,2.396,8.177,2.396 c9.812,0,15.176-8.128,15.176-15.177c0-0.231-0.005-0.461-0.015-0.69C26.38,8.945,27.285,8.006,28,6.937z"></path></svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;