import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import Logo from '../../Logo Pack/logo.svg';
import loader from '../../loader.png';

const Schedule = () => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [formData, setFormData] = useState({ name: '', username: '', schedule: '', message: '' });
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const canvasRef = useRef(null); // Reference for the canvas

    useEffect(() => {
        const fetchBookedSlots = async () => {
            try {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, 'bookedSlots'));
                const slots = querySnapshot.docs.map(doc => doc.data().schedule);
                setBookedSlots(slots);

                generateSlots(slots);
            } finally {
                setLoading(false);
            }
        };

        const generateSlots = (bookedSlots) => {
            const slots = [];
            const today = new Date();

            for (let day = 0; day < 14; day++) {
                const date = new Date(today);
                date.setDate(today.getDate() + day);

                for (let hour = 8; hour <= 21; hour++) {
                    for (let minute = 0; minute < 60; minute += 3) {
                        const time = new Date(date);
                        time.setHours(hour, minute, 0, 0);

                        const formattedSlot = time.toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        });

                        if (!bookedSlots.includes(formattedSlot)) {
                            slots.push(formattedSlot);
                        }
                    }
                }
            }
            setAvailableSlots(slots);
        };

        fetchBookedSlots();
    }, []);

    const downloadAndRedirect = () => {
        const canvas = canvasRef.current;
    
        // Create a link element
        const link = document.createElement('a');
        link.download = `${formData.username}-ticket.png`; // Name the file with the username
        link.href = canvas.toDataURL('image/png'); // Convert canvas to PNG
    
        // Append to the body to trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up
    
        // Redirect to another page (replace '/your-next-page' with the actual path)
        window.location.href = '/download';
    };
    

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'username' && value) {
            const usernameRef = doc(db, 'bookedSlots', value);
            const usernameSnap = await getDoc(usernameRef);
            setIsUsernameTaken(usernameSnap.exists());
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, username, schedule, message } = formData;
        if (isUsernameTaken) {
            alert('Username already exists! Please choose another.');
            return;
        }

        setIsSubmitting(true);
        try {
            await setDoc(doc(db, 'bookedSlots', username), {
                name,
                username,
                schedule,
                message
            });
            setShowSuccessPopup(true);
            generateTicket();
        } catch (error) {
            console.error('Error scheduling call:', error);
            alert('There was an error scheduling your call. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateTicket = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Set canvas dimensions
        canvas.width = 400;
        canvas.height = 800;

        // Colors
        const primaryColor = "#0D21A1"; // Primary Dark Blue
        const backgroundColor = "#F1FAEE"; // Background Light
        const textColor = "#2E3532"; // Dark Text Color
        const lightBlue = "#89A6FB"; // Light Blue for subheadings

        // Background
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Header
        context.fillStyle = primaryColor;
        context.fillRect(0, 0, canvas.width, 80);
        context.font = "bold 24px Arial";
        context.fillStyle = "#FFFFFF"; // White text for header
        context.textAlign = "center";
        context.fillText("Powered By TMD.", canvas.width / 2, 50);

        // Content Styling
        context.textAlign = "left";
        context.font = "bold 18px Arial";
        context.fillStyle = lightBlue;

        // Username Label
        context.fillText("Username", 20, 120);
        context.font = "bold 24px Arial";
        context.fillStyle = textColor;
        context.fillText(formData.username, 20, 150);

        // Name Label
        context.font = "bold 18px Arial";
        context.fillStyle = lightBlue;
        context.fillText("Name", 20, 200);
        context.font = "bold 24px Arial";
        context.fillStyle = textColor;
        context.fillText(formData.name, 20, 230);

        // Schedule Label
        context.font = "bold 18px Arial";
        context.fillStyle = lightBlue;
        context.fillText("Schedule", 20, 280);
        context.font = "bold 20px Arial";
        context.fillStyle = textColor;
        context.fillText(formData.schedule, 20, 310);

        // Message Label
        context.font = "bold 18px Arial";
        context.fillStyle = lightBlue;
        context.fillText("Message", 20, 360);
        context.font = "20px Arial";
        context.fillStyle = textColor;
        context.fillText(formData.message || "No message provided.", 20, 390, 360); // wrap text

        // Footer Note
        context.fillStyle = primaryColor; // Dark blue for footer text
        context.font = "16px Arial";
        context.textAlign = "center";
        context.fillText(
            "Please show this ticket to TMD a minute",
            canvas.width / 2,
            canvas.height - 70
        );
        context.fillText(
            "before the schedule for verification.",
            canvas.width / 2,
            canvas.height - 45
        );
    };



    return (
        <div>
            <div>
                <img className='h-12 m-2' src={Logo} alt="Logo" />
            </div>
            <div className='justify-center pt-10 md:pt-0 items-center md:w-[30rem] px-10 mx-auto'>
                <h3 className='text-center text-dark text-2xl'>Enter your details to schedule a call.</h3>
                <div className='py-6'>
                    {loading ? (
                        <div><img className='animate-spin my-40 mx-36 h-10' src={loader} alt="Loading" /></div>
                    ) : (
                        <form onSubmit={handleSubmit} className='gap-x-10'>
                            <div className='flex flex-col mx-3 my-5'>
                                <label>Name</label>
                                <input
                                    name="name"
                                    placeholder='Enter your name here.'
                                    className='bg-accent/40 border outline-none p-1 border-main rounded shadow shadow-slate-400'
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='flex flex-col mx-3 my-5'>
                                <label>UserName</label>
                                <input
                                    name="username"
                                    placeholder='Create a unique username.'
                                    className={`bg-accent/40 border outline-none p-1 border-main rounded shadow shadow-slate-400 ${isUsernameTaken ? 'border-red-500' : ''}`}
                                    type="text"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                                {isUsernameTaken && <p className="text-red-500">Username is already taken.</p>}
                            </div>
                            <div className='flex flex-col mx-3 my-5'>
                                <label>Schedule</label>
                                <select
                                    name="schedule"
                                    className='bg-accent/40 border outline-none p-1 border-main rounded shadow shadow-slate-400'
                                    value={formData.schedule}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select a slot</option>
                                    {availableSlots.map((slot, index) => (
                                        <option key={index} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col mx-3 my-5'>
                                <label>Message (optional)</label>
                                <textarea
                                    name="message"
                                    placeholder="Send a short message to TMD."
                                    className="bg-accent/40 border outline-none p-1 border-main rounded shadow shadow-slate-400"
                                    rows={7}
                                    maxLength={100} // Limit input to 100 characters
                                    value={formData.message}
                                    onChange={handleInputChange}
                                />

                            </div>
                            <button type="submit" className='text-center p-2 my-3  mx-1 md:mx-0 w-full font-medium bg-main rounded-md shadow-lg text-light'>
                                {isSubmitting ? 'Generating ticket...' : 'Get your ticket'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Canvas for Ticket */}
            <canvas ref={canvasRef} width={400} height={300} style={{ display: "none" }}></canvas>

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white bg-opacity-30 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h4 className="text-xl font-semibold text-center mb-2">Success!</h4>
                        <p className="text-center text-gray-800">Please proceed to print your ticket.</p>
                        <button onClick={downloadAndRedirect} className="mt-4 w-full bg-main text-light p-2 rounded-md">
                            Print Ticket
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
