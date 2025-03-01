import { FiShare2 } from 'react-icons/fi';

const ShareButton = ({ journeyDetails }) => {
  const handleShare = async () => {
    const shareData = {
      title: 'Ramadan Journey Plan',
      text: `Traveling from ${journeyDetails.origin} to ${journeyDetails.destination}.
             Iftar Time: ${journeyDetails.iftarTime}.
             Recommendation: ${journeyDetails.recommendation}`,
      url: window.location.href
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      alert('Sharing not supported - copy manually');
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="btn btn-outline-dark w-100 mt-4"
    >
      <FiShare2 className="me-2" />
      Share Journey Details
    </button>
  );
};

export default ShareButton;