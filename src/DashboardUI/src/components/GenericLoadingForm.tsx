import { Placeholder } from 'react-bootstrap';

function GenericLoadingForm() {
  const renderPlaceholders = () => {
    const groups = [];
    const placeholdersPerGroup = 10;
    const totalPlaceholders = 30;

    for (let groupIndex = 0; groupIndex < totalPlaceholders / placeholdersPerGroup; groupIndex++) {
      const groupPlaceholders = [];
      for (let i = 0; i < placeholdersPerGroup; i++) {
        const key = groupIndex * placeholdersPerGroup + i;
        groupPlaceholders.push(
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={key}>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={8} className="mb-2 rounded fs-2" />
              <Placeholder xs={12} className="rounded fs-2" />
            </Placeholder>
          </div>,
        );
      }
      groups.push(
        <div className="mb-4" key={`group-${groupIndex}`}>
          <Placeholder as="h5" animation="glow" className="mb-4">
            <Placeholder xs={5} className="fs-2 rounded" />
          </Placeholder>
          <div className="row">{groupPlaceholders}</div>
        </div>,
      );
    }

    return groups;
  };

  return <div>{renderPlaceholders()}</div>;
}

export default GenericLoadingForm;
