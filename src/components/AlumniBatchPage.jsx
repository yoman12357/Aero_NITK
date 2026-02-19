import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import Footer from "./footer.jsx";
import "./AlumniPage.css";

const alumniData = {
  "2024": [
    { name: "OJAS AGRAWAL", linkedin: "https://share.google/CPtcO871FQiCzy1A4" },
            { name: "Abhiraj Pravin Mengade", linkedin: "https://share.google/o4uz5MDg6JSPFbZRk" },
            { name: "Mehul Todi", linkedin: "https://in.linkedin.com/in/mehul-todi" },
            { name: "Madhav Kumar", linkedin: "https://in.linkedin.com/in/minimaddy" },
            { name: "Mohammad Bilal", linkedin: "https://ae.linkedin.com/in/bilalsheni" },
            { name: "Chirag R", linkedin: "https://in.linkedin.com/in/chirag-r-b090a4218" },
            { name: "Rahul Gaikwad", linkedin: "https://in.linkedin.com/in/rahulgaikwad9a" },
            { name: "Manish", linkedin: "https://in.linkedin.com/in/bmanishkumar" },
            { name: "Hrishikesh Kulkarni", linkedin: "https://in.linkedin.com/in/hrishi-9b098b217" },
            { name: "Adithyan Mundayadu", linkedin: "https://in.linkedin.com/in/adithyanv" },
            { name: "Anirudh Singh Solanki", linkedin: "https://in.linkedin.com/in/anirudh-singh-solanki-69bb191bb" },
            { name: "Dharaneedaran K S", linkedin: "https://in.linkedin.com/in/dharaneedaran-kalyanam-sendhil-724497206" },
            { name: "Saniya Bhargava", linkedin: "https://ie.linkedin.com/in/saniyabhargava" },
            { name: "Vinamra Parakh", linkedin: "https://in.linkedin.com/in/vinamra-parakh-9b20a6218" },
            { name: "Kaustubh Khedkar", linkedin: "https://in.linkedin.com/in/kaustubh-khedkar-844290216" },
            { name: "Amey Maheshwari", linkedin: "https://in.linkedin.com/in/amey-maheshwari-236681225" },
            { name: "D Karan", linkedin: "https://in.linkedin.com/in/karandhinakaran" },
            { name: "Siddh Narhari", linkedin: "https://www.linkedin.com/in/siddhnarhari" },
            { name: "Karan Devendra Panchal", linkedin: "https://in.linkedin.com/in/karan-panchal-58a823202" },
            { name: "Akash Deepak Shah", linkedin: "https://in.linkedin.com/in/akash-shah-6a293a217" },
            { name: "Aviral Vinit", linkedin: "https://in.linkedin.com/in/aviral-vinit-a2a610202" },
            { name: "Samith Hegde", linkedin: "https://in.linkedin.com/in/samith-hegde" },
            { name: "Sukrit Dass T M", linkedin: "https://in.linkedin.com/in/sukrit-dass" },
  ],
  "2025": [
    { name: "Harshit Ravindra Gawade", linkedin: "https://in.linkedin.com/in/harshit-gawade-3187a5197" },
            { name: "Mauli Mehulkumar Patel", linkedin: "https://in.linkedin.com/in/mauli-patel-42450922a" },
            { name: "Raghavendra", linkedin: "https://in.linkedin.com/in/draghav" },
            { name: "SIDHAARTH SREDHARAN", linkedin: "https://www.linkedin.com/in/sidhaarth-murali/" },
            { name: "Imamhusen.H.K", linkedin: "https://in.linkedin.com/in/imamhusen-konasagar-11932022a" },
            { name: "Keshav Mittal", linkedin: "https://in.linkedin.com/in/keshav-mittal-93012123b" },
            { name: "Aditya Raj Kashyap", linkedin: "https://in.linkedin.com/in/aditya-raj-kashyap-074559254" },
            { name: "Anirved Pandey", linkedin: "https://in.linkedin.com/in/anirved-pandey-8a5485272" },
            { name: "Chhote Lal Bairwa", linkedin: "https://in.linkedin.com/in/cldadr" },
            { name: "Vidit", linkedin: "https://in.linkedin.com/in/vidit-gala-0165a0235" },
            { name: "N Ranjith Shetty", linkedin: "https://in.linkedin.com/in/ranjith-shetty-034a96224" },
            { name: "Aditya Prakash Prabhu", linkedin: "https://in.linkedin.com/in/aditya-prakash-a1d2i3" },
            { name: "Joel Jojo Painuthara", linkedin: "https://in.linkedin.com/in/joeljojop" },
            { name: "Karan S", linkedin: "https://in.linkedin.com/in/karan-sheoran-06935360" },
            { name: "Kuntimalla Jashwanth", linkedin: "https://in.linkedin.com/in/kuntimallajashwanthnitk" },
            { name: "N Dhruva", linkedin: "https://in.linkedin.com/in/n-dhruva" },
            { name: "Sreehari Krishnan", linkedin: "https://in.linkedin.com/in/sreeharikrishnan-nitk" },
            { name: "Suraj Gupta", linkedin: "https://in.linkedin.com/in/suraj789" },
            { name: "Amit Sharma", linkedin: "https://in.linkedin.com/in/ams201301" },
            { name: "Anurag Mahto", linkedin: "https://in.linkedin.com/in/anurag-mahto-973545310" },
            { name: "Vedant Tarale", linkedin: "https://in.linkedin.com/in/vedant-tarale" },
            { name: "Dadi Vishnu Vardhan", linkedin: "https://in.linkedin.com/in/vishnu-vardhan-dadi-756145224" },
            { name: "Rajashri Varadaraj", linkedin: "https://in.linkedin.com/in/rajashri-varadaraj-6b375b232" },
            { name: "Diya", linkedin: "https://in.linkedin.com/in/k-v-diya-murali-7368a0226" },
{ name: "Harshak Sachdeva", linkedin: "https://in.linkedin.com/in/harsha-k-p-a37b4818b" },
{ name: "Sahil Kule", linkedin: "https://in.linkedin.com/in/sahil-kule" },
{ name: "Madhav", linkedin: "https://in.linkedin.com/in/m-dhingra" },
{ name: "P.Arunachalam", linkedin: "https://in.linkedin.com/in/arunachalam-p-801863225" },
{ name: "Prakhar Goel", linkedin: "https://in.linkedin.com/in/goel-prakhar" },
{ name: "Shreeya Jayantha", linkedin: "https://in.linkedin.com/in/shriya-bharadwaj-0375662a9" },
{ name: "Srinath Seshadri", linkedin: "https://in.linkedin.com/in/srinath-seshadri-b5b481251" },
{ name: "Abhishek Satpathy", linkedin: "https://www.linkedin.com/in/abhishek-satpathy/" },
{ name: "Garvit Goyal", linkedin: "https://in.linkedin.com/in/garvit-goyal" },
{ name: "Shubham", linkedin: "https://in.linkedin.com/in/shubham-gupta1543" },
{ name: "Adithya KR", linkedin: "https://in.linkedin.com/in/kr-adithya" },
{ name: "Anshuman Upadhyay", linkedin: "https://in.linkedin.com/in/anshuman-upadhyay-233882227" },
{ name: "Darshan Maloo", linkedin: "https://in.linkedin.com/in/darshanmaloo85" },
{ name: "Deepanshu Mahale", linkedin: "https://in.linkedin.com/in/deepanshu-mahale-8680a5200" },
{ name: "Gautam Raj", linkedin: "https://www.linkedin.com/pub/dir/Gautam/......raj" },
{ name: "Ginka Neeraja", linkedin: "https://in.linkedin.com/in/ginka-neeraja-1714022b4" },
{ name: "Homen Taid", linkedin: "https://in.linkedin.com/in/homen-taid-130616237" },
{ name: "Mwkthang Brahma", linkedin: "https://in.linkedin.com/in/mwkthang-brahma-45046019a" },
{ name: "Pooja M", linkedin: "https://in.linkedin.com/in/poojamk" },
{ name: "Vadera Smit", linkedin: "https://in.linkedin.com/in/smit-vadera-25a928248" },
{ name: "D.Niranjan", linkedin: "https://in.linkedin.com/in/niranjan-d-18986023b" },
{ name: "Dhiren V Bhandary", linkedin: "https://in.linkedin.com/in/dhiren-v-bhandary" },
{ name: "G R Rakshatha", linkedin: "https://in.linkedin.com/in/g-r-rakshatha-8656b3295" },
{ name: "Lapsiwala Jashkumar Janak", linkedin: "https://in.linkedin.com/in/jashlapsiwala" },
{ name: "Pulibandla Charan", linkedin: "https://in.linkedin.com/in/charan-pulibandla" },
{ name: "Samit Vijapur", linkedin: "https://in.linkedin.com/in/samit-vijapur-755a3a254" },
{ name: "Vijayasimha H M", linkedin: "https://in.linkedin.com/in/vijay-simha-37aa6029a" },
{ name: "pavan kumar r", linkedin: "https://in.linkedin.com/in/pavan-kumar-r-a0a517248" },
{ name: "Lasya", linkedin: "https://in.linkedin.com/in/lasya-reddy-217ba7250" },
{ name: "Ala Krishna Lasya", linkedin: "https://in.linkedin.com/in/ala-krishna-lasya-8757a227a" },
{ name: "Aryan Kumar Verma", linkedin: "https://in.linkedin.com/in/aryan-kumar-verma-one-square-nitk" },
{ name: "Medha Nethicallu", linkedin: "https://in.linkedin.com/in/medha-nethicallu-20318a261" },
{ name: "Nischith gowd", linkedin: "https://in.linkedin.com/in/nischith-gowd-822260247" },
{ name: "Raghavendra Pandurang Jadhav", linkedin: "" },
{ name: "Sai Priya", linkedin: "https://in.linkedin.com/in/sai-priya-s-b00411239" },
{ name: "Sugam Gowda S", linkedin: "https://in.linkedin.com/in/sugam-gowda-s-439121287" },
{ name: "Aayush Kumar Jha", linkedin: "https://in.linkedin.com/in/ayush-kumar-5a2ab4299" },
{ name: "Chowhan Sardar", linkedin: "https://in.linkedin.com/in/chowhan-sardar-013609238" },
{ name: "Manish Mamgain", linkedin: "https://in.linkedin.com/in/manish-mamgain-18a306238" },


  ]
};

const AlumniBatchPage = () => {
  const { batchId } = useParams();
  const alumniList = alumniData[batchId] || [];

  return (
    <div className="alumni-page-wrapper">
      <main className="alumni-container">
        <h1 className="alumni-header-text">Batch {batchId}</h1>

        <div className="alumni-list-grid">
          {alumniList.map((alumni, index) => (
            <div key={index} className="alumni-list-card">
              <span>{alumni.name}</span>

              {alumni.linkedin && (
                <a
                  href={alumni.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-icon"
                >
                  <FaLinkedin />
                </a>
              )}
            </div>
          ))}
        </div>

        <Link to="/alumni" className="back-button">
          ← Back to Alumni
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default AlumniBatchPage;
