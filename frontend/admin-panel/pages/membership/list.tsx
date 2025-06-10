import React, { useState } from 'react';
import Card from "@/components/Card/Card";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import ActionButton from "@/components/common/ActionButton/ActionButton";

import styles from "@/styles/Home.module.css";

const data = [
    { avatar: "https://tuitioncenter.s3.amazonaws.com/profileImages/5926f99b-efcb-4e11-ab72-3086720ab672/istockphoto-1318854270-612x612.webp", firstName: "Ahmed", lastName: "Mohamed", status: "Active", city: "Mogadishu" },
    { avatar: "", firstName: "Fatima", lastName: "Ali", status: "Pending", city: "Kismayo" },
    { avatar: "https://tuitioncenter.s3.amazonaws.com/profileImages/5926f99b-efcb-4e11-ab72-3086720ab672/istockphoto-1406474099-612x612.webp", firstName: "Ismail", lastName: "Farah", status: "Inactive", city: "Bosaso" },
    { avatar: "", firstName: "Abdi", lastName: "Mohamed", status: "Active", city: "Jowhar" },
    { avatar: "https://tuitioncenter.s3.amazonaws.com/profileImages/5926f99b-efcb-4e11-ab72-3086720ab672/istockphoto-1401461283-612x612.webp", firstName: "Amina", lastName: "Abdi", status: "Banned", city: "Garowe" },
    { avatar: "", firstName: "Ali", lastName: "Hassan", status: "Active", city: "Baidoa" },
    { avatar: "https://tuitioncenter.s3.amazonaws.com/profileImages/5926f99b-efcb-4e11-ab72-3086720ab672/istockphoto-1961461283-612x612.webp", firstName: "Mariam", lastName: "Jama", status: "Pending", city: "Mogadishu" },
    { avatar: "", firstName: "Faisal", lastName: "Farah", status: "Inactive", city: "Burao" },
    { avatar: "", firstName: "Yusuf", lastName: "Ali", status: "Active", city: "Galkayo" },
    { avatar: "https://tuitioncenter.s3.amazonaws.com/profileImages/5926f99b-efcb-4e11-ab72-3086720ab672/istockphoto-1494354639-612x612.webp", firstName: "Samiya", lastName: "Omar", status: "Active", city: "Hargeisa" },
    { avatar: "", firstName: "Mohamed", lastName: "Hassan", status: "Banned", city: "Mogadishu" },
    { avatar: "", firstName: "Muna", lastName: "Mohamed", status: "Pending", city: "Kismayo" },
    { avatar: "", firstName: "Omar", lastName: "Mohamed", status: "Inactive", city: "Bosaso" },
    { avatar: "", firstName: "Ruqiya", lastName: "Abdullahi", status: "Active", city: "Belet Weyne" },
    { avatar: "", firstName: "Ahmed", lastName: "Omar", status: "Pending", city: "Galkayo" },
    { avatar: "", firstName: "Khadra", lastName: "Mohamed", status: "Banned", city: "Jowhar" },
    { avatar: "", firstName: "Hussein", lastName: "Ahmed", status: "Active", city: "Mogadishu" },
    { avatar: "", firstName: "Salah", lastName: "Ali", status: "Inactive", city: "Hargeisa" },
    { avatar: "", firstName: "Khadija", lastName: "Ali", status: "Pending", city: "Galkayo" },
    { avatar: "", firstName: "Mohamed", lastName: "Mohamud", status: "Active", city: "Baidoa" },
    { avatar: "", firstName: "Saeed", lastName: "Omar", status: "Active", city: "Mogadishu" }
];

const App: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // Number of items to display per page

    // Filtered data based on search query
    const filteredData = data.filter(person =>
        person.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Get the current page's data
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle input change for search
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Go to next page
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    // Go to previous page
    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className={styles.container}>
            <SearchInput
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Type to search..."
            />

            <div className={styles.cardList}>
                {currentData.map((person, index) => (
                    <Card
                        key={index}
                        avatar={person.avatar}
                        firstName={person.firstName}
                        lastName={person.lastName}
                        status={person.status}
                        city={person.city}
                    />
                ))}
            </div>

            <div className={styles.pagination}>
                <ActionButton
                    className={styles.paginationButton}
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                >
                    Prev
                </ActionButton>

                <span className={styles.paginationInfo}>
            Page {currentPage} of {totalPages}
        </span>

                <ActionButton
                    className={styles.paginationButton}
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </ActionButton>
            </div>
        </div>
    );
};

export default App;
