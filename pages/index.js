import React, { useEffect, useState } from 'react';
import '../app/globals.css';
import '../src/assets/css/style.css'
import '../src/assets/css/home.css'
import dynamic from "next/dynamic"; 
const Banner = dynamic(()=> import('../src/components/Banner/Banner'))
const HomeEvents = dynamic(()=> import('../src/components/Calendar/HomeEvents'))
const Header = dynamic(()=> import('../src/components/Header/Header'))
const Picture = dynamic(()=> import('../src/atoms/Image'))
const Footer = dynamic(()=> import('../src/components/Footer/Footer'))
const Container = dynamic(()=> import('../src/components/Container/Container'))
const HeroSection = dynamic(()=> import('../src/components/Hero Section/HeroSection'))
const Heading = dynamic(()=> import('../src/atoms/Heading'))
const Paragraph = dynamic(()=> import('../src/atoms/Paragraph'))



function Index() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/facebook');
        if (!response.ok) {
          throw new Error('Failed to fetch Facebook posts');
        }

        const data = await response.json();
        console.log('Facebook API response:', data);
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching Facebook posts:', error.message);
      }
    };
    fetchPosts();
  }, []);



  return (
    <div>
      <Header
        mainhdrclass='p-4 bg-gray-800 border-b-2 main-header'
        titleclass='text-white text-2xl'
        hdrinrclass = 'flex justify-between items-center'
      />
      <HeroSection
        mainherclass = 'snip-hero'
        heroinrclass = 'relative grid grid-cols-2 inner-hero-section gap-8 items-center'
        h3 = 'Visit Us' 
        h1 = 'Welcome To SNIP Web Portal' 
        p1 = 'This website is a place for members of the industry side of school nutrition to share ideas, challenges, job postings and anything else that will aid in providing the best service to our school nutrition customers.'
        tb = ''
        width='500' 
        height='500'
        leftimgclass = 'relative left-side-banner'
        leftimg="/images/snip-banner-new.png"
        bnrbgclass1 = 'bg-image'
        bnrbgclass2 = 'bag-left-image'
      />
      <div className='below-border'>
      <svg className="nectar-shape-divider" fill="#2351d5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300" preserveAspectRatio="none">
          <path d="M 1014 264 v 122 h -808 l -172 -86 s 310.42 -22.84 402 -79 c 106 -65 154 -61 268 -12 c 107 46 195.11 5.94 275 137 z"></path>   <path d="M -302 55 s 235.27 208.25 352 159 c 128 -54 233 -98 303 -73 c 92.68 33.1 181.28 115.19 235 108 c 104.9 -14 176.52 -173.06 267 -118 c 85.61 52.09 145 123 145 123 v 74 l -1306 10 z"></path>
          <path d="M -286 255 s 214 -103 338 -129 s 203 29 384 101 c 145.57 57.91 178.7 50.79 272 0 c 79 -43 301 -224 385 -63 c 53 101.63 -62 129 -62 129 l -107 84 l -1212 12 z"></path>
          <path d="M -24 69 s 299.68 301.66 413 245 c 8 -4 233 2 284 42 c 17.47 13.7 172 -132 217 -174 c 54.8 -51.15 128 -90 188 -39 c 76.12 64.7 118 99 118 99 l -12 132 l -1212 12 z"></path>
          <path d="M -12 201 s 70 83 194 57 s 160.29 -36.77 274 6 c 109 41 184.82 24.36 265 -15 c 55 -27 116.5 -57.69 214 4 c 49 31 95 26 95 26 l -6 151 l -1036 10 z"></path> </svg>
      
      </div>

      <Banner
        bannerclass='main-bnr-class pt-28'
        bnrinrclass='flex justify-center gap-10 clander-dis'
        bnrrclass='w-2/5'
        titleclass='text-4xl mb-8'
        bnrtitle='Event Calender'
        paragraphclass='tex-xl'
        bnrparagraph='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget consequat nulla. Vestibulum non libero eget odio tristique malesuada. Curabitur fringilla, odio vel varius scelerisque, diam felis ullamcorper elit, ac vehicula elit felis vel dui. Phasellus vitae libero ac justo dapibus consequat.'
        bnrleftclass='w-3/5'
        bnrleftcont={<HomeEvents />}
        
      />
      
    
      <div className='fb-post my-16'>
        <Container>
        <Heading level='2' headingText='Facebook Posts'/>
        <div className='grid gap-x-8 gap-y-4 grid-cols-3'>
          {Array.isArray(posts?.posts?.data) && posts.posts.data.length > 0 ? (
            posts.posts.data.map((post) => (
              <div key={post.id} className='fb-post-coulmn bg-gray-50 rounded-md p-8'>
                <div className='page-cnt'>
                  <Picture key={`${post.id}-profile-picture`} src={posts.picture?.data?.url} alt={`Profile picture of ${posts.name}`} />
                  <div>
                    <Paragraph ParagraphText={posts.name} />
                    <Paragraph ParagraphText= {post.created_time} />
                  </div>
                </div>
                <Picture LogoClass='w-full my-6' key={`${post.id}-image`} src={post.full_picture} alt={`Post ${post.id} image`} />
                <Paragraph ParagraphText={post.message} />
              </div>
            ))
          ) : (
            <Paragraph ParagraphText='No posts available' />
          )}
        </div>
        </Container>
      </div>
      <Footer
        mainftrclass='p-4 footer-scc text-center bg-gray-800 border-b-2 main-ftr'
        titleclass='text-white text-2xl'
      />
    </div>
  )
}

export default Index