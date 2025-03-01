import { FiHeart } from "react-icons/fi";

const CharityOrganizations = () => {
  const charities = [
    {
      name: "Community Food Drive",
      contact: "contact@ramadanfood.org",
      services: ["Iftar Packs", "Suhoor Delivery"]
    },
    {
      name: "Needy Family Support",
      contact: "555-HELP-NOW",
      services: ["Financial Aid", "Clothing Donations"]
    }
  ];

  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <FiHeart className="me-2 text-danger" />
        Local Charities
      </div>
      <div className="card-body">
        <div className="row g-3">
          {charities.map((org, index) => (
            <div key={index} className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">{org.name}</h6>
                  <p className="mb-1">
                    <small>Contact: {org.contact}</small>
                  </p>
                  <div className="mt-2">
                    {org.services.map((service, i) => (
                      <span key={i} className="badge bg-light text-dark me-1">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharityOrganizations;