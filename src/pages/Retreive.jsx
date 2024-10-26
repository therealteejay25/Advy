import React, { useState, useRef } from 'react';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Logo Pack/logo.svg';

const Retrieve = () => {
    const [username, setUsername] = useState('');
    const [ticketData, setTicketData] = useState(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const ticketRef = doc(db, 'bookedSlots', username);
            const ticketSnap = await getDoc(ticketRef);

            if (ticketSnap.exists()) {
                const data = ticketSnap.data();
                setTicketData(data);
                generateTicket(data);
            } else {
                alert('No ticket found for this username!');
                setTicketData(null); // Clear ticket data
            }
        } catch (error) {
            console.error('Error retrieving ticket:', error);
            alert('There was an error retrieving your ticket. Please try again.');
        }
    };

    const generateTicket = (data) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

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
        context.fillText(data.username, 20, 150);

        // Name Label
        context.font = "bold 18px Arial";
        context.fillStyle = lightBlue;
        context.fillText("Name", 20, 200);
        context.font = "bold 24px Arial";
        context.fillStyle = textColor;
        context.fillText(data.name, 20, 230);

        // Schedule Label
        context.font = "bold 18px Arial";
        context.fillStyle = lightBlue;
        context.fillText("Schedule", 20, 280);
        context.font = "bold 20px Arial";
        context.fillStyle = textColor;
        context.fillText(data.schedule, 20, 310);

        // Message Label
        context.font = "bold 18px Arial";
        context.fillStyle = lightBlue;
        context.fillText("Message", 20, 360);
        context.font = "20px Arial";
        context.fillStyle = textColor;
        context.fillText(data.message || "No message provided.", 20, 390, 360); // wrap text

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

    const downloadTicket = () => {
        if (!ticketData) {
            alert('Please retrieve your ticket first!');
            return;
        }

        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `${ticketData.username}_ticket.png`;
        link.href = canvas.toDataURL();
        link.click();
        navigate('/download'); // Redirect to download page
    };

    return (
        <div className='bg-light h-screen'>
            <div className='p-2'>
                <img className='h-12' src={Logo} alt="" />
            </div>
            <div className='md:py-16 py-28 px-10 md:px-0'>
                <div>
                    <h2 className='text-center text-3xl'>Misplaced your ticket....<br />Retrieve it with <span className='text-accent'>Advy.</span></h2>
                </div>
                <form onSubmit={handleSubmit} className='text-center flex flex-col md:w-[30rem] mx-auto'>
                    <div className='flex flex-col my-8'>
                        <label htmlFor="" className='text-left text-dark font-medium'>UserName</label>
                        <input
                            type="text"
                            placeholder='Your username here...'
                            className='p-2 rounded-md bg-accent/30 border border-main my-1 outline-none'
                            value={username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit" className='bg-main rounded-md text-light py-2'>Retrieve your ticket.</button>
                {ticketData && (
                    <button onClick={downloadTicket} className='bg-main rounded-md text-light py-2 mt-4'>
                        Download Ticket
                    </button>
                )}
                </form>
            </div>
            {/* Canvas for Ticket */}
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
    );
};

export default Retrieve;
