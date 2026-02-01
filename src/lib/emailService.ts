import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ADMIN = import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN;
const EMAILJS_TEMPLATE_GUEST = import.meta.env.VITE_EMAILJS_TEMPLATE_GUEST;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

interface BookingEmailData {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  nights: number;
  totalPrice: string;
  deposit: string;
  balance: string;
}

// אתחול EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// שליחה למנהל (אלייך)
export const sendAdminEmail = async (data: BookingEmailData) => {
  try {
    const templateParams = {
      ...data,
      to_email: 'oriaboudi2001@gmail.com', // המייל שלך (קבוע)
      orderDate: new Date().toLocaleString('he-IL'),
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ADMIN,
      templateParams
    );

    console.log('✅ Admin email sent successfully!', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to send admin email:', error);
    throw error;
  }
};

// שליחה לאורח
export const sendGuestEmail = async (data: BookingEmailData) => {
  try {
    const templateParams = {
      ...data,
      to_email: data.email, // המייל של האורח
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_GUEST,
      templateParams
    );

    console.log('✅ Guest email sent successfully!', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to send guest email:', error);
    throw error;
  }
};

// שליחה לשניהם
export const sendBookingEmails = async (data: BookingEmailData) => {
  try {
    await Promise.all([
      sendAdminEmail(data),
      sendGuestEmail(data),
    ]);
    console.log('✅ Both emails sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send emails:', error);
    throw error;
  }
};