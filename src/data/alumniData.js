import alumniImg1 from '../images/alumni/alumni1.png';
import alumniImg2 from '../images/alumni/alumni2.jpeg';

const getAlumniImage = (batchId, fileName) =>
    new URL(`../images/alumni/${batchId}/${fileName}`, import.meta.url).href;

// Initial Batch Folders (similar to Gallery Folders)
export const initialBatchFolders = [
    {
        id: "2025",
        year: "2025",
        name: "Batch 2025",
        cover: alumniImg2,
        description: "AeroNITK Graduating Class of 2025"
    },
    {
        id: "2024",
        year: "2024",
        name: "Batch 2024",
        cover: alumniImg1,
        description: "AeroNITK Graduating Class of 2024"
    }
];

// Initial Alumni Records by Batch
export const initialAlumniData = {
    "2024": [
        { id: "2024-1", name: "Ojas Agrawal", batch: "2024", image: getAlumniImage("2024", "ojas_agrawal.jpg"), linkedin: "https://share.google/CPtcO871FQiCzy1A4" },
        { id: "2024-2", name: "Abhiraj Pravin Mengade", batch: "2024", image: getAlumniImage("2024", "abhiraj_mengade.jpg"), linkedin: "https://share.google/o4uz5MDg6JSPFbZRk" },
        { id: "2024-3", name: "Mehul Todi", batch: "2024", image: getAlumniImage("2024", "mehul_todi.jpg"), linkedin: "https://in.linkedin.com/in/mehul-todi" },
        { id: "2024-4", name: "Madhav Kumar", batch: "2024", image: getAlumniImage("2024", "madhav_kumar.jpg"), linkedin: "https://in.linkedin.com/in/minimaddy" },
        { id: "2024-5", name: "Mohammad Bilal", batch: "2024", image: getAlumniImage("2024", "mohammad_bilal.jpg"), linkedin: "https://ae.linkedin.com/in/bilalsheni" },
        { id: "2024-6", name: "Chirag R", batch: "2024", image: getAlumniImage("2024", "chirag_r.jpg"), linkedin: "https://in.linkedin.com/in/chirag-r-b090a4218" },
        { id: "2024-7", name: "Rahul Gaikwad", batch: "2024", image: getAlumniImage("2024", "rahul_gaiwad.jpg"), linkedin: "https://in.linkedin.com/in/rahulgaikwad9a" },
        { id: "2024-8", name: "Manish", batch: "2024", image: getAlumniImage("2024", "manish_kumar_b.jpg"), linkedin: "https://in.linkedin.com/in/bmanishkumar" },
        { id: "2024-9", name: "Hrishikesh Kulkarni", batch: "2024", image: getAlumniImage("2024", "hrishikesh_kulkami.jpg"), linkedin: "https://in.linkedin.com/in/hrishi-9b098b217" },
        { id: "2024-10", name: "Adithyan Mundayadu", batch: "2024", image: getAlumniImage("2024", "adithyan_mundayadu.jpg"), linkedin: "https://in.linkedin.com/in/adithyanv" },
        { id: "2024-11", name: "Anirudh Singh Solanki", batch: "2024", image: getAlumniImage("2024", "anirudh_singh_solanki.jpg"), linkedin: "https://in.linkedin.com/in/anirudh-singh-solanki-69bb191bb" },
        { id: "2024-12", name: "Dharaneedaran K S", batch: "2024", image: getAlumniImage("2024", "dharaneedaran_kalyanam_sendhil.jpg"), linkedin: "https://in.linkedin.com/in/dharaneedaran-kalyanam-sendhil-724497206" },
        { id: "2024-13", name: "Saniya Bhargava", batch: "2024", image: getAlumniImage("2024", "saniya_bhargava.jpg"), linkedin: "https://ie.linkedin.com/in/saniyabhargava" },
        { id: "2024-14", name: "Vinamra Parakh", batch: "2024", image: getAlumniImage("2024", "vinamra_parakh.jpg"), linkedin: "https://in.linkedin.com/in/vinamra-parakh-9b20a6218" },
        { id: "2024-15", name: "Kaustubh Khedkar", batch: "2024", image: getAlumniImage("2024", "kaustubh_khedkar.jpg"), linkedin: "https://in.linkedin.com/in/kaustubh-khedkar-844290216" },
        { id: "2024-16", name: "Amey Maheshwari", batch: "2024", image: getAlumniImage("2024", "amey_maheshwari.jpg"), linkedin: "https://in.linkedin.com/in/amey-maheshwari-236681225" },
        { id: "2024-17", name: "D Karan", batch: "2024", image: getAlumniImage("2024", "karan_dhinakaran.jpg"), linkedin: "https://in.linkedin.com/in/karandhinakaran" },
        { id: "2024-18", name: "Siddh Narhari", batch: "2024", image: getAlumniImage("2024", "siddh_narhari.jpg"), linkedin: "https://www.linkedin.com/in/siddhnarhari" },
        { id: "2024-19", name: "Karan Devendra Panchal", batch: "2024", image: getAlumniImage("2024", "karan_panchal.jpg"), linkedin: "https://in.linkedin.com/in/karan-panchal-58a823202" },
        { id: "2024-20", name: "Akash Deepak Shah", batch: "2024", image: getAlumniImage("2024", "akash_shah.jpg"), linkedin: "https://in.linkedin.com/in/akash-shah-6a293a217" },
        { id: "2024-21", name: "Aviral Vinit", batch: "2024", image: getAlumniImage("2024", "aviral_vinit.jpg"), linkedin: "https://in.linkedin.com/in/aviral-vinit-a2a610202" },
        { id: "2024-22", name: "Samith Hegde", batch: "2024", image: getAlumniImage("2024", "samith_hegde.jpg"), linkedin: "https://in.linkedin.com/in/samith-hegde" },
        { id: "2024-23", name: "Sukrit Dass T M", batch: "2024", image: getAlumniImage("2024", "sukrit_dass.jpg"), linkedin: "https://in.linkedin.com/in/sukrit-dass" },
    ],
    "2025": [
        { id: "2025-1", name: "Harshit Ravindra Gawade", batch: "2025", image: getAlumniImage("2025", "harshit_gawade.jpg"), linkedin: "https://in.linkedin.com/in/harshit-gawade-3187a5197" },
        { id: "2025-2", name: "Mauli Mehulkumar Patel", batch: "2025", image: getAlumniImage("2025", "mauli_patel.jpg"), linkedin: "https://in.linkedin.com/in/mauli-patel-42450922a" },
        { id: "2025-3", name: "Raghavendra", batch: "2025", image: getAlumniImage("2025", "raghavendra_d.jpg"), linkedin: "https://in.linkedin.com/in/draghav" },
        { id: "2025-4", name: "SIDHAARTH SREDHARAN", batch: "2025", image: getAlumniImage("2025", "sidhaarth_sredharan_murali.jpg"), linkedin: "https://www.linkedin.com/in/sidhaarth-murali/" },
        { id: "2025-5", name: "Imamhusen.H.K", batch: "2025", image: getAlumniImage("2025", "imamhusen_konasagar.jpg"), linkedin: "https://in.linkedin.com/in/imamhusen-konasagar-11932022a" },
        { id: "2025-6", name: "Keshav Mittal", batch: "2025", image: getAlumniImage("2025", "keshav_mittal.gif"), linkedin: "https://in.linkedin.com/in/keshav-mittal-93012123b" },
        { id: "2025-7", name: "Aditya Raj Kashyap", batch: "2025", image: getAlumniImage("2025", "aditya_raj_kashyap.jpg"), linkedin: "https://in.linkedin.com/in/aditya-raj-kashyap-074559254" },
        { id: "2025-8", name: "Anirved Pandey", batch: "2025", image: getAlumniImage("2025", "anrived_pandey.gif"), linkedin: "https://in.linkedin.com/in/anirved-pandey-8a5485272" },
        { id: "2025-9", name: "Chhote Lal Bairwa", batch: "2025", image: getAlumniImage("2025", "chhote_lal_bairwa.gif"), linkedin: "https://in.linkedin.com/in/cldadr" },
        { id: "2025-10", name: "Vidit", batch: "2025", image: getAlumniImage("2025", "vidir_gala.jpg"), linkedin: "https://in.linkedin.com/in/vidit-gala-0165a0235" },
        { id: "2025-11", name: "N Ranjith Shetty", batch: "2025", image: getAlumniImage("2025", "ranjith_shetty.gif"), linkedin: "https://in.linkedin.com/in/ranjith-shetty-034a96224" },
        { id: "2025-12", name: "Aditya Prakash Prabhu", batch: "2025", image: getAlumniImage("2025", "aditya_prakash.jpg"), linkedin: "https://in.linkedin.com/in/aditya-prakash-a1d2i3" },
        { id: "2025-13", name: "Joel Jojo Painuthara", batch: "2025", image: getAlumniImage("2025", "joel_jojo_painuthara.jpg"), linkedin: "https://in.linkedin.com/in/joeljojop" },
        { id: "2025-14", name: "Karan S", batch: "2025", image: getAlumniImage("2025", "karan_sheoran.gif"), linkedin: "https://in.linkedin.com/in/karan-sheoran-06935360" },
        { id: "2025-15", name: "Kuntimalla Jashwanth", batch: "2025", image: getAlumniImage("2025", "jashwanth_kuntimalla.jpg"), linkedin: "https://in.linkedin.com/in/kuntimallajashwanthnitk" },
        { id: "2025-16", name: "N Dhruva", batch: "2025", image: getAlumniImage("2025", "dhruva_n.jpg"), linkedin: "https://in.linkedin.com/in/n-dhruva" },
        { id: "2025-17", name: "Sreehari Krishnan", batch: "2025", image: getAlumniImage("2025", "sreehari_krishnan.jpg"), linkedin: "https://in.linkedin.com/in/sreeharikrishnan-nitk" },
        { id: "2025-18", name: "Suraj Gupta", batch: "2025", image: getAlumniImage("2025", "suraj_gupta.jpg"), linkedin: "https://in.linkedin.com/in/suraj789" },
        { id: "2025-19", name: "Amit Sharma", batch: "2025", image: getAlumniImage("2025", "amit_sharma.jpg"), linkedin: "https://in.linkedin.com/in/ams201301" },
        { id: "2025-20", name: "Anurag Mahto", batch: "2025", image: getAlumniImage("2025", "anurag_mahto.jpg"), linkedin: "https://in.linkedin.com/in/anurag-mahto-973545310" },
        { id: "2025-21", name: "Vedant Tarale", batch: "2025", image: getAlumniImage("2025", "vadant_tarale.jpg"), linkedin: "https://in.linkedin.com/in/vedant-tarale" },
        { id: "2025-22", name: "Dadi Vishnu Vardhan", batch: "2025", image: getAlumniImage("2025", "vishnu_vardhan_dadi.jpg"), linkedin: "https://in.linkedin.com/in/vishnu-vardhan-dadi-756145224" },
        { id: "2025-23", name: "Rajashri Varadaraj", batch: "2025", image: getAlumniImage("2025", "rajashri_varadaraj.gif"), linkedin: "https://in.linkedin.com/in/rajashri-varadaraj-6b375b232" },
        { id: "2025-24", name: "Diya", batch: "2025", image: getAlumniImage("2025", "k_v_diya_murali.jpg"), linkedin: "https://in.linkedin.com/in/k-v-diya-murali-7368a0226" },
        { id: "2025-25", name: "Harshak Sachdeva", batch: "2025", image: getAlumniImage("2025", "harsha_k_p.jpg"), linkedin: "https://in.linkedin.com/in/harsha-k-p-a37b4818b" },
        { id: "2025-26", name: "Sahil Kule", batch: "2025", image: getAlumniImage("2025", "sahil_kule.jpg"), linkedin: "https://in.linkedin.com/in/sahil-kule" },
        { id: "2025-27", name: "Madhav", batch: "2025", image: getAlumniImage("2025", "madhav_dhingra.jpg"), linkedin: "https://in.linkedin.com/in/m-dhingra" },
        { id: "2025-28", name: "P.Arunachalam", batch: "2025", image: getAlumniImage("2025", "arunachalam_p.jpg"), linkedin: "https://in.linkedin.com/in/arunachalam-p-801863225" },
        { id: "2025-29", name: "Prakhar Goel", batch: "2025", image: getAlumniImage("2025", "prakhar_goel.jpg"), linkedin: "https://in.linkedin.com/in/goel-prakhar" },
        { id: "2025-30", name: "Shreeya Jayantha", batch: "2025", image: getAlumniImage("2025", "shreeya_jayantha.jpg"), linkedin: "https://www.linkedin.com/in/shreeya-jayantha-180794313" },
        { id: "2025-31", name: "Srinath Seshadri", batch: "2025", image: getAlumniImage("2025", "srinath_seshadri.jpg"), linkedin: "https://in.linkedin.com/in/srinath-seshadri-b5b481251" },
        { id: "2025-32", name: "Abhishek Satpathy", batch: "2025", image: getAlumniImage("2025", "abhisek_satpathy.jpg"), linkedin: "https://www.linkedin.com/in/abhishek-satpathy/" },
        { id: "2025-33", name: "Garvit Goyal", batch: "2025", image: getAlumniImage("2025", "garvit_goyal.jpg"), linkedin: "https://in.linkedin.com/in/garvit-goyal" },
        { id: "2025-34", name: "Shubham", batch: "2025", linkedin: "" },
        { id: "2025-35", name: "Adithya KR", batch: "2025", image: getAlumniImage("2025", "adithya_k_r.jpg"), linkedin: "https://in.linkedin.com/in/kr-adithya" },
        { id: "2025-36", name: "Anshuman Upadhyay", batch: "2025", image: getAlumniImage("2025", "anshuman_upadhyay.jpg"), linkedin: "https://in.linkedin.com/in/anshuman-upadhyay-233882227" },
        { id: "2025-37", name: "Darshan Maloo", batch: "2025", image: getAlumniImage("2025", "darshan_maloo.jpg"), linkedin: "https://in.linkedin.com/in/darshanmaloo85" },
        { id: "2025-38", name: "Deepanshu Mahale", batch: "2025", image: getAlumniImage("2025", "deepanshu_mahale.jpg"), linkedin: "https://in.linkedin.com/in/deepanshu-mahale-8680a5200" },
        { id: "2025-39", name: "Gautam Raj", batch: "2025", linkedin: "https://www.linkedin.com/pub/dir/Gautam/......raj" },
        { id: "2025-40", name: "Ginka Neeraja", batch: "2025", image: getAlumniImage("2025", "ginka_neeraja.gif"), linkedin: "https://in.linkedin.com/in/ginka-neeraja-1714022b4" },
        { id: "2025-41", name: "Homen Taid", batch: "2025", image: getAlumniImage("2025", "homen_taid.jpg"), linkedin: "https://in.linkedin.com/in/homen-taid-130616237" },
        { id: "2025-42", name: "Mwkthang Brahma", batch: "2025", image: getAlumniImage("2025", "mwkthang_brahma.jpg"), linkedin: "https://in.linkedin.com/in/mwkthang-brahma-45046019a" },
    ]
};

export const initialBatchCovers = {
    "2024": alumniImg1,
    "2025": alumniImg2,
};

const BATCHES_KEY = 'aeronitk_alumni_batches_v2';
const ALUMNI_KEY = 'aeronitk_alumni_members_v2';
export const ALUMNI_UPDATED_EVENT = 'aeronitk:alumni_updated';

// -----------------------------------------------------------------------------
// BATCH FOLDER MANAGEMENT (Similar to Gallery Folders)
// -----------------------------------------------------------------------------

export const getStoredBatches = () => {
    try {
        const stored = localStorage.getItem(BATCHES_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Error reading stored batches", e);
    }
    return initialBatchFolders;
};

export const saveStoredBatches = (batches) => {
    try {
        localStorage.setItem(BATCHES_KEY, JSON.stringify(batches));
        window.dispatchEvent(new CustomEvent(ALUMNI_UPDATED_EVENT, { detail: { type: 'batches', data: batches } }));
    } catch (e) {
        console.error("Error saving batches", e);
    }
};

export const addBatchFolder = ({ year, name, cover, description }) => {
    const batches = getStoredBatches();
    const cleanYear = String(year || '').trim();
    const cleanName = name?.trim() || `Batch ${cleanYear}`;

    // Ensure unique ID
    const id = cleanYear || `batch-${Date.now()}`;
    const newFolder = {
        id,
        year: cleanYear,
        name: cleanName,
        cover: cover || null,
        description: description?.trim() || `AeroNITK Graduating Class of ${cleanYear}`
    };

    const exists = batches.some(b => b.id === id);
    const updated = exists
        ? batches.map(b => b.id === id ? { ...b, ...newFolder } : b)
        : [newFolder, ...batches];

    saveStoredBatches(updated);
    return newFolder;
};

export const updateBatchFolder = (batchId, updatedFields) => {
    const batches = getStoredBatches();
    const updated = batches.map(b => b.id === batchId ? { ...b, ...updatedFields } : b);
    saveStoredBatches(updated);
    return updated;
};

export const deleteBatchFolder = (batchId) => {
    const batches = getStoredBatches();
    const updatedBatches = batches.filter(b => b.id !== batchId);
    saveStoredBatches(updatedBatches);

    // Also remove alumni records for this batch
    const alumni = getStoredAlumni();
    const updatedAlumni = { ...alumni };
    delete updatedAlumni[batchId];
    saveStoredAlumni(updatedAlumni);

    return updatedBatches;
};

// -----------------------------------------------------------------------------
// ALUMNI MEMBERS MANAGEMENT
// -----------------------------------------------------------------------------

export const getStoredAlumni = () => {
    try {
        const stored = localStorage.getItem(ALUMNI_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Error reading stored alumni data", e);
    }
    return initialAlumniData;
};

export const saveStoredAlumni = (data) => {
    try {
        localStorage.setItem(ALUMNI_KEY, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent(ALUMNI_UPDATED_EVENT, { detail: { type: 'alumni', data } }));
    } catch (e) {
        console.error("Error saving alumni data", e);
    }
};

export const addAlumni = (alumniMember) => {
    const data = getStoredAlumni();
    const batchKey = String(alumniMember.batch || '2025').trim();
    const newMember = {
        id: alumniMember.id || `alumni-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: alumniMember.name.trim(),
        batch: batchKey,
        role: alumniMember.role ? alumniMember.role.trim() : '',
        company: alumniMember.company ? alumniMember.company.trim() : '',
        image: alumniMember.image || null,
        linkedin: alumniMember.linkedin ? alumniMember.linkedin.trim() : ''
    };

    const currentBatchList = data[batchKey] || [];
    const updatedData = {
        ...data,
        [batchKey]: [newMember, ...currentBatchList]
    };

    saveStoredAlumni(updatedData);
    return newMember;
};

export const updateAlumni = (batchKey, alumniId, updatedFields) => {
    const data = getStoredAlumni();
    const currentList = data[batchKey] || [];
    const updatedList = currentList.map(item =>
        (item.id === alumniId || item.name === alumniId)
            ? { ...item, ...updatedFields }
            : item
    );

    const updatedData = {
        ...data,
        [batchKey]: updatedList
    };

    saveStoredAlumni(updatedData);
    return updatedData;
};

export const deleteAlumni = (batchKey, alumniId) => {
    const data = getStoredAlumni();
    const currentBatchList = data[batchKey] || [];
    const updatedBatchList = currentBatchList.filter(item => (item.id || item.name) !== alumniId);

    const updatedData = {
        ...data,
        [batchKey]: updatedBatchList
    };

    saveStoredAlumni(updatedData);
    return updatedData;
};
