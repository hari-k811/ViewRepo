import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchCommitData } from './api';
import CommitsChart from './CommitsChart';

const RepositoryModal = ({ repository, onClose }) => {
  const [commitData, setCommitData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCommitData(repository, currentPage).then((data) => {
      setCommitData(data);
    });
  }, [repository, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Modal isOpen={true} onRequestClose={onClose}>
      <h2>{repository.name}</h2>
      <CommitsChart data={commitData.slice((currentPage - 1) * 10, currentPage * 10)} />
      <div>
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        <span>Page {currentPage}</span>
        <button disabled={commitData.length < 10} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </Modal>
  );
};

export default RepositoryModal;