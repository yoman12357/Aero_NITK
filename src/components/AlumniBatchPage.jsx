import React from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "./footer.jsx";
import "./AlumniPage.css";
import { Helmet } from 'react-helmet-async';
import ProfileCard from "./ui/ProfileCard.jsx";

const getAlumniImage = (batchId, fileName) => new URL(`../images/alumni/${batchId}/${fileName}`, import.meta.url).href;

const alumniData = {
  "2024": [
    { name: "Ojas Agrawal", image: getAlumniImage("2024", "ojas_agrawal.jpg"), linkedin: "https://share.google/CPtcO871FQiCzy1A4" },
    { name: "Abhiraj Pravin Mengade", image: getAlumniImage("2024", "abhiraj_mengade.jpg"), linkedin: "https://share.google/o4uz5MDg6JSPFbZRk" },
    { name: "Mehul Todi", image: getAlumniImage("2024", "mehul_todi.jpg"), linkedin: "https://in.linkedin.com/in/mehul-todi" },
    { name: "Madhav Kumar", image: getAlumniImage("2024", "madhav_kumar.jpg"), linkedin: "https://in.linkedin.com/in/minimaddy" },
    { name: "Mohammad Bilal", image: getAlumniImage("2024", "mohammad_bilal.jpg"), linkedin: "https://ae.linkedin.com/in/bilalsheni" },
    { name: "Chirag R", image: getAlumniImage("2024", "chirag_r.jpg"), linkedin: "https://in.linkedin.com/in/chirag-r-b090a4218" },
    { name: "Rahul Gaikwad", image: getAlumniImage("2024", "rahul_gaiwad.jpg"), linkedin: "https://in.linkedin.com/in/rahulgaikwad9a" },
    { name: "Manish", image: getAlumniImage("2024", "manish_kumar_b.jpg"), linkedin: "https://in.linkedin.com/in/bmanishkumar" },
    { name: "Hrishikesh Kulkarni", image: getAlumniImage("2024", "hrishikesh_kulkami.jpg"), linkedin: "https://in.linkedin.com/in/hrishi-9b098b217" },
    { name: "Adithyan Mundayadu", image: getAlumniImage("2024", "adithyan_mundayadu.jpg"), linkedin: "https://in.linkedin.com/in/adithyanv" },
    { name: "Anirudh Singh Solanki", image: getAlumniImage("2024", "anirudh_singh_solanki.jpg"), linkedin: "https://in.linkedin.com/in/anirudh-singh-solanki-69bb191bb" },
    { name: "Dharaneedaran K S", image: getAlumniImage("2024", "dharaneedaran_kalyanam_sendhil.jpg"), linkedin: "https://in.linkedin.com/in/dharaneedaran-kalyanam-sendhil-724497206" },
    { name: "Saniya Bhargava", image: getAlumniImage("2024", "saniya_bhargava.jpg"), linkedin: "https://ie.linkedin.com/in/saniyabhargava" },
    { name: "Vinamra Parakh", image: getAlumniImage("2024", "vinamra_parakh.jpg"), linkedin: "https://in.linkedin.com/in/vinamra-parakh-9b20a6218" },
    { name: "Kaustubh Khedkar", image: getAlumniImage("2024", "kaustubh_khedkar.jpg"), linkedin: "https://in.linkedin.com/in/kaustubh-khedkar-844290216" },
    { name: "Amey Maheshwari", image: getAlumniImage("2024", "amey_maheshwari.jpg"), linkedin: "https://in.linkedin.com/in/amey-maheshwari-236681225" },
    { name: "D Karan", image: getAlumniImage("2024", "karan_dhinakaran.jpg"), linkedin: "https://in.linkedin.com/in/karandhinakaran" },
    { name: "Siddh Narhari", image: getAlumniImage("2024", "siddh_narhari.jpg"), linkedin: "https://www.linkedin.com/in/siddhnarhari" },
    { name: "Karan Devendra Panchal", image: getAlumniImage("2024", "karan_panchal.jpg"), linkedin: "https://in.linkedin.com/in/karan-panchal-58a823202" },
    { name: "Akash Deepak Shah", image: getAlumniImage("2024", "akash_shah.jpg"), linkedin: "https://in.linkedin.com/in/akash-shah-6a293a217" },
    { name: "Aviral Vinit", image: getAlumniImage("2024", "aviral_vinit.jpg"), linkedin: "https://in.linkedin.com/in/aviral-vinit-a2a610202" },
    { name: "Samith Hegde", image: getAlumniImage("2024", "samith_hegde.jpg"), linkedin: "https://in.linkedin.com/in/samith-hegde" },
    { name: "Sukrit Dass T M", image: getAlumniImage("2024", "sukrit_dass.jpg"), linkedin: "https://in.linkedin.com/in/sukrit-dass" },
  ],
  "2025": [
    { name: "Harshit Ravindra Gawade", image: getAlumniImage("2025", "harshit_gawade.jpg"), linkedin: "https://in.linkedin.com/in/harshit-gawade-3187a5197" },
    { name: "Mauli Mehulkumar Patel", image: getAlumniImage("2025", "mauli_patel.jpg"), linkedin: "https://in.linkedin.com/in/mauli-patel-42450922a" },
    { name: "Raghavendra", image: getAlumniImage("2025", "raghavendra_d.jpg"), linkedin: "https://in.linkedin.com/in/draghav" },
    { name: "SIDHAARTH SREDHARAN", image: getAlumniImage("2025", "sidhaarth_sredharan_murali.jpg"), linkedin: "https://www.linkedin.com/in/sidhaarth-murali/" },
    { name: "Imamhusen.H.K", image: getAlumniImage("2025", "imamhusen_konasagar.jpg"), linkedin: "https://in.linkedin.com/in/imamhusen-konasagar-11932022a" },
    { name: "Keshav Mittal", image: getAlumniImage("2025", "keshav_mittal.gif"), linkedin: "https://in.linkedin.com/in/keshav-mittal-93012123b" },
    { name: "Aditya Raj Kashyap", image: getAlumniImage("2025", "aditya_raj_kashyap.jpg"), linkedin: "https://in.linkedin.com/in/aditya-raj-kashyap-074559254" },
    { name: "Anirved Pandey", image: getAlumniImage("2025", "anrived_pandey.gif"), linkedin: "https://in.linkedin.com/in/anirved-pandey-8a5485272" },
    { name: "Chhote Lal Bairwa", image: getAlumniImage("2025", "chhote_lal_bairwa.gif"), linkedin: "https://in.linkedin.com/in/cldadr" },
    { name: "Vidit", image: getAlumniImage("2025", "vidir_gala.jpg"), linkedin: "https://in.linkedin.com/in/vidit-gala-0165a0235" },
    { name: "N Ranjith Shetty", image: getAlumniImage("2025", "ranjith_shetty.gif"), linkedin: "https://in.linkedin.com/in/ranjith-shetty-034a96224" },
    { name: "Aditya Prakash Prabhu", image: getAlumniImage("2025", "aditya_prakash.jpg"), linkedin: "https://in.linkedin.com/in/aditya-prakash-a1d2i3" },
    { name: "Joel Jojo Painuthara", image: getAlumniImage("2025", "joel_jojo_painuthara.jpg"), linkedin: "https://in.linkedin.com/in/joeljojop" },
    { name: "Karan S", image: getAlumniImage("2025", "karan_sheoran.gif"), linkedin: "https://in.linkedin.com/in/karan-sheoran-06935360" },
    { name: "Kuntimalla Jashwanth", image: getAlumniImage("2025", "jashwanth_kuntimalla.jpg"), linkedin: "https://in.linkedin.com/in/kuntimallajashwanthnitk" },
    { name: "N Dhruva", image: getAlumniImage("2025", "dhruva_n.jpg"), linkedin: "https://in.linkedin.com/in/n-dhruva" },
    { name: "Sreehari Krishnan", image: getAlumniImage("2025", "sreehari_krishnan.jpg"), linkedin: "https://in.linkedin.com/in/sreeharikrishnan-nitk" },
    { name: "Suraj Gupta", image: getAlumniImage("2025", "suraj_gupta.jpg"), linkedin: "https://in.linkedin.com/in/suraj789" },
    { name: "Amit Sharma", image: getAlumniImage("2025", "amit_sharma.jpg"), linkedin: "https://in.linkedin.com/in/ams201301" },
    { name: "Anurag Mahto", image: getAlumniImage("2025", "anurag_mahto.jpg"), linkedin: "https://in.linkedin.com/in/anurag-mahto-973545310" },
    { name: "Vedant Tarale", image: getAlumniImage("2025", "vadant_tarale.jpg"), linkedin: "https://in.linkedin.com/in/vedant-tarale" },
    { name: "Dadi Vishnu Vardhan", image: getAlumniImage("2025", "vishnu_vardhan_dadi.jpg"), linkedin: "https://in.linkedin.com/in/vishnu-vardhan-dadi-756145224" },
    { name: "Rajashri Varadaraj", image: getAlumniImage("2025", "rajashri_varadaraj.gif"), linkedin: "https://in.linkedin.com/in/rajashri-varadaraj-6b375b232" },
    { name: "Diya", image: getAlumniImage("2025", "k_v_diya_murali.jpg"), linkedin: "https://in.linkedin.com/in/k-v-diya-murali-7368a0226" },
    { name: "Harshak Sachdeva", image: getAlumniImage("2025", "harsha_k_p.jpg"), linkedin: "https://in.linkedin.com/in/harsha-k-p-a37b4818b" },
    { name: "Sahil Kule", image: getAlumniImage("2025", "sahil_kule.jpg"), linkedin: "https://in.linkedin.com/in/sahil-kule" },
    { name: "Madhav", image: getAlumniImage("2025", "madhav_dhingra.jpg"), linkedin: "https://in.linkedin.com/in/m-dhingra" },
    { name: "P.Arunachalam", image: getAlumniImage("2025", "arunachalam_p.jpg"), linkedin: "https://in.linkedin.com/in/arunachalam-p-801863225" },
    { name: "Prakhar Goel", image: getAlumniImage("2025", "prakhar_goel.jpg"), linkedin: "https://in.linkedin.com/in/goel-prakhar" },
    { name: "Shreeya Jayantha", image: getAlumniImage("2025", "shreeya_jayantha.jpg"), linkedin: "https://www.linkedin.com/in/shreeya-jayantha-180794313" },
    { name: "Srinath Seshadri", image: getAlumniImage("2025", "srinath_seshadri.jpg"), linkedin: "https://in.linkedin.com/in/srinath-seshadri-b5b481251" },
    { name: "Abhishek Satpathy", image: getAlumniImage("2025", "abhisek_satpathy.jpg"), linkedin: "https://www.linkedin.com/in/abhishek-satpathy/" },
    { name: "Garvit Goyal", image: getAlumniImage("2025", "garvit_goyal.jpg"), linkedin: "https://in.linkedin.com/in/garvit-goyal" },
    { name: "Shubham", linkedin: "" },
    { name: "Adithya KR", image: getAlumniImage("2025", "adithya_k_r.jpg"), linkedin: "https://in.linkedin.com/in/kr-adithya" },
    { name: "Anshuman Upadhyay", image: getAlumniImage("2025", "anshuman_upadhyay.jpg"), linkedin: "https://in.linkedin.com/in/anshuman-upadhyay-233882227" },
    { name: "Darshan Maloo", image: getAlumniImage("2025", "darshan_maloo.jpg"), linkedin: "https://in.linkedin.com/in/darshanmaloo85" },
    { name: "Deepanshu Mahale", image: getAlumniImage("2025", "deepanshu_mahale.jpg"), linkedin: "https://in.linkedin.com/in/deepanshu-mahale-8680a5200" },
    { name: "Gautam Raj", linkedin: "https://www.linkedin.com/pub/dir/Gautam/......raj" },
    { name: "Ginka Neeraja", image: getAlumniImage("2025", "ginka_neeraja.gif"), linkedin: "https://in.linkedin.com/in/ginka-neeraja-1714022b4" },
    { name: "Homen Taid", image: getAlumniImage("2025", "homen_taid.jpg"), linkedin: "https://in.linkedin.com/in/homen-taid-130616237" },
    { name: "Mwkthang Brahma", image: getAlumniImage("2025", "mwkthang_brahma.jpg"), linkedin: "https://in.linkedin.com/in/mwkthang-brahma-45046019a" },
    { name: "Pooja M", image: getAlumniImage("2025", "pooja_kumar.jpg"), linkedin: "https://in.linkedin.com/in/poojamk" },
    { name: "Vadera Smit", image: getAlumniImage("2025", "smit_vadera.jpg"), linkedin: "https://in.linkedin.com/in/smit-vadera-25a928248" },
    { name: "D.Niranjan", image: getAlumniImage("2025", "niranjan_d.jpg"), linkedin: "https://in.linkedin.com/in/niranjan-d-18986023b" },
    { name: "Dhiren V Bhandary", image: getAlumniImage("2025", "dhiren_v_bhandary.jpg"), linkedin: "https://in.linkedin.com/in/dhiren-v-bhandary" },
    { name: "G R Rakshatha", image: getAlumniImage("2025", "g_r_rakshatha.gif"), linkedin: "https://in.linkedin.com/in/g-r-rakshatha-8656b3295" },
    { name: "Lapsiwala Jashkumar Janak", image: getAlumniImage("2025", "jashkumar_lapsiwala.jpg"), linkedin: "https://in.linkedin.com/in/jashlapsiwala" },
    { name: "Pulibandla Charan", image: getAlumniImage("2025", "charan_pulibandla.jpg"), linkedin: "https://in.linkedin.com/in/charan-pulibandla" },
    { name: "Samit Vijapur", image: getAlumniImage("2025", "samit_vijapur.jpg"), linkedin: "https://in.linkedin.com/in/samit-vijapur-755a3a254" },
    { name: "Vijayasimha H M", image: getAlumniImage("2025", "vijay_simha.jpg"), linkedin: "https://in.linkedin.com/in/vijay-simha-37aa6029a" },
    { name: "pavan kumar r", image: getAlumniImage("2025", "pavan_kumar_r.jpg"), linkedin: "https://in.linkedin.com/in/pavan-kumar-r-a0a517248" },
    { name: "Lasya", image: getAlumniImage("2025", "lasya_reddy.jpg"), linkedin: "https://in.linkedin.com/in/lasya-reddy-217ba7250" },
    { name: "Ala Krishna Lasya", image: getAlumniImage("2025", "ala_krshina_lasya.gif"), linkedin: "https://in.linkedin.com/in/ala-krishna-lasya-8757a227a" },
    { name: "Aryan Kumar Verma", image: getAlumniImage("2025", "aryan_kumar_verma.jpg"), linkedin: "https://in.linkedin.com/in/aryan-kumar-verma-one-square-nitk" },
    { name: "Medha Nethicallu", image: getAlumniImage("2025", "medha_nethicallu.gif"), linkedin: "https://in.linkedin.com/in/medha-nethicallu-20318a261" },
    { name: "Nischith gowd", image: getAlumniImage("2025", "nischith_gowd.jpg"), linkedin: "https://in.linkedin.com/in/nischith-gowd-822260247" },
    { name: "Raghavendra Pandurang Jadhav", linkedin: "" },
    { name: "Sai Priya", image: getAlumniImage("2025", "sai_priya_s.jpg"), linkedin: "https://in.linkedin.com/in/sai-priya-s-b00411239" },
    { name: "Sugam Gowda S", image: getAlumniImage("2025", "sugam_gowda_s.gif"), linkedin: "https://in.linkedin.com/in/sugam-gowda-s-439121287" },
    { name: "Aayush Kumar Jha", image: getAlumniImage("2025", "ayush_kumar.jpg"), linkedin: "https://in.linkedin.com/in/ayush-kumar-5a2ab4299" },
    { name: "Chowhan Sardar", image: getAlumniImage("2025", "chowhan_sardar.jpg"), linkedin: "https://in.linkedin.com/in/chowhan-sardar-013609238" },
    { name: "Manish Mamgain", image: getAlumniImage("2025", "manish_mamgain.jpg"), linkedin: "https://in.linkedin.com/in/manish-mamgain-18a306238" },


  ]
};

const AlumniBatchPage = () => {
  const { batchId } = useParams();
  const alumniList = alumniData[batchId] || [];

  return (
    <div className="alumni-page-wrapper">
      <Helmet>
        <title>Batch {batchId} Alumni | Aero NITK</title>
        <meta name="description" content={`Explore the records and member details for the Aero NITK Alumni Batch ${batchId}.`} />
        <link rel="canonical" href={`https://aeronitk.in/alumni/${batchId}`} />
      </Helmet>
      <main className="alumni-container">
        <h1 className="alumni-header-text">Batch {batchId}</h1>

        <div className="alumni-list-grid">
          {alumniList.map((alumni, index) => (
            <ProfileCard
              key={index}
              name={alumni.name}
              image={alumni.image}
              linkedin={alumni.linkedin}
            />
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
