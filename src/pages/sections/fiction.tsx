import { useNavigate } from 'react-router-dom';


export const Fiction = () => {
   const navigateMain = useNavigate();

   const handlenavigateMain = (path: string) => {
      navigateMain(path)
   }

   return (
      <div className="section-content">
         <div className='backgroundImg'>
            <img src='/images/76289.jpg' className='bg_img'/>
         </div>
         <div className="stories" onClick={() => handlenavigateMain('/sections/stories')}>
            <div className='image-container'>
               <img src="/images/story.png" alt="Stories" className='sectionimg subsectionimg storyimg' />
            </div>
            <p>Stories</p>
         </div>
         <div className="poems" onClick={() => handlenavigateMain('/sections/poems')}>
            <div className='image-container'>
               <img src="/images/poem.jpg" alt="Poems" className='sectionimg subsectionimg poemimg' />
            </div>
            <p>Poems</p>
         </div>
      </div>
   )
}