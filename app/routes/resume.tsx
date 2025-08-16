import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import ATS from "~/components/ATS";
import Summary from "~/components/Summary";
import Details from "~/components/Details";

export const meta = () => ([
    {title: 'Resumind | Review'},
    {name: 'description', content: 'Detailed analysis of your resume'}
])



const Resume = () => {
    const {auth, isLoading, kv, fs} = usePuterStore();
    const {id} = useParams();
    const[imageUrl, setImageUrl] = useState('');
    const[resumeUrl, setResumeUrl] = useState('');
    const[feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate(); //for the home button at the top

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async() => {
            const resume = await kv.get(`resume:${id}`) //provides the information stored

            if (!resume) return;

            const data = JSON.parse(resume) //will return info as blobs (pdf blob and image blob), that we must convert into IMG

            const resumeBlob = await fs.read(data.resumePath)
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);

            console.log({imageUrl, resumeUrl, feedback: data.feedback});
        }
        loadResume();
    }, [id])

     //get the generated uuid that directs to the correct route
    return (
        //returning back home button
        <main className="!pt-0">
            <nav className="flex flex-row justify-between items-center p-4 border-b">
                <Link to= "/" className= "back-button">
                    <img src = "/icons/back.svg" alt="logo" className= "w-2.5 h-2.5" />
                    <span className= "text-gray-500 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center rounded-4xl">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border rounded-2xl max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                        <a href={resumeUrl} target="_blank" rel="noreferrer">
                            <img
                            src={imageUrl}
                            alt = "resume-img"
                            className= "w-full h-full object-contain rounded-2xl"
                            title = "resume"
                            />
                        </a>
                        </div>
                    )}
                </section>
                <section className= "feedback-section">
                    {feedback && (
                    <span className= "rounded-lg p-2 shadow-md bg-blue-200">
                        <h2 className = "text-4xl !text-black font-bold text-center">Resume Review</h2>
                    </span>
                    )}
                    {feedback ? (
                        <div className = "flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback = {feedback} />
                            <ATS score = {feedback.ATS.score || 0} suggestions = {feedback.ATS.tips || []}/>
                            <Details feedback = {feedback}/>
                        </div>
                    ) : (
                        <img src= '/images/resume-scan-2.gif' alt = "find-resume" className= "w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume;