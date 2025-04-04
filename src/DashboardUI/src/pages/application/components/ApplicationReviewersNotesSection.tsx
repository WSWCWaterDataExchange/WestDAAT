import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { useAuthenticationContext } from '../../../hooks/useAuthenticationContext';
import { formatDateString } from '../../../utilities/valueFormatters';
import ApplicationFormSection from './ApplicationFormSection';

import './ApplicationReviewersNotesSection.scss';

function ApplicationReviewersNotesSection() {
  const { state } = useConservationApplicationContext();
  const notes = state.conservationApplication.reviewerNotes;

  const { user } = useAuthenticationContext();

  // docs: https://momentjs.com/docs/#/displaying/
  const momentJsLocalizedDateFormatString = 'llll';

  return (
    <>
      <hr className="text-primary" />
      <ApplicationFormSection title="Notes from Reviewers (Hidden from Applicant)" className="col mb-4">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className={`container p-3 note-container ${user?.userId === note.submittedByUserId ? 'my-note' : ''}`}
            >
              <div className="d-flex gap-3">
                <div>
                  <span className="text-primary">{note.submittedByFullName}</span>
                </div>
                <div>
                  <span className="text-muted fst-italic">
                    Posted {formatDateString(note.submittedDate, momentJsLocalizedDateFormatString)}
                  </span>
                </div>
              </div>

              <div>
                <span>{note.note}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No notes from reviewers.</p>
        )}
      </ApplicationFormSection>
    </>
  );
}

export default ApplicationReviewersNotesSection;
