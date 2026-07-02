import { StoredSubmission } from "@/data/records";

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      // YYYY-MM-DD to DD/MM/YYYY
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  } catch (e) {}
  return dateStr;
};

export const downloadSubmissionPdf = (submission: StoredSubmission) => {
  const data = submission.formData || {};
  const formType = submission.formType;
  const category = submission.category; // individual or organization

  let htmlContent = "";
  let filename = "";

  const renderField = (label: string, value: any, widthClass: string) => `
    <div class="col ${widthClass}">
      <span class="field-label">${label}</span>
      <div class="field-value">${value !== undefined && value !== null ? value : ""}</div>
    </div>
  `;

  const renderCheckbox = (label: string, checked: boolean) => `
    <div class="checkbox-item">
      <div class="checkbox-box">${checked ? "✓" : ""}</div>
      <span>${label}</span>
    </div>
  `;

  if (formType === "claim") {
    // CLAIM FORM PDF
    filename = `Archery_Record_Claim_Form_${submission.id}.pdf`;
    htmlContent = `
      <!-- PAGE 1 -->
      <div class="page">
        <div class="header">
          <div class="logo-box">LOGO</div>
          <div class="header-titles">
            <div class="org-title">Archery Book of World Records</div>
            <div class="doc-subtitle">Completed record attempt – claim form</div>
          </div>
          <div class="page-indicator">
            Page 1 of 2<br>Claimant & completed attempt details
          </div>
        </div>

        <div class="banner">
          This is a claim for a record attempt that has already taken place without prior submission of a record
          application. This claim will be reviewed strictly against the official verification rules & procedures of the
          Archery Book of Records. Approval is not guaranteed and depends entirely on the sufficiency of evidence provided.
        </div>

        <div style="font-size: 8px; color: #555; margin-bottom: 5px; text-align: right;">* indicates a mandatory field</div>

        <!-- Section 1 -->
        <div class="section-title">1. Claimant information</div>
        <div class="row">
          ${renderField("Full legal name *", data.name || submission.name, "col-65")}
          ${renderField("Date of birth (DD/MM/YYYY) *", formatDate(data.dob || submission.dob), "col-35")}
        </div>
        <div class="row">
          ${renderField("Gender *", data.gender, "col-30")}
          ${renderField("Nationality *", data.nationality, "col-35")}
          ${renderField("Age category (Junior / Senior / Veteran) *", data.ageCategory, "col-35")}
        </div>
        <div class="row">
          ${renderField("Residential address *", data.address, "col-100")}
        </div>
        <div class="row">
          ${renderField("City *", data.city, "col-35")}
          ${renderField("State / Province *", data.state, "col-35")}
          ${renderField("Postal code *", data.postalCode, "col-30")}
        </div>
        <div class="row">
          ${renderField("Email address *", data.email || submission.email, "col-55")}
          ${renderField("Phone number *", data.phone || submission.phone, "col-45")}
        </div>

        <!-- Section 2 -->
        <div class="section-title">2. Archery profile</div>
        <div class="row">
          ${renderField("Discipline (Recurve / Compound / Traditional / Para-archery) *", data.discipline, "col-60")}
          ${renderField("Bow type *", data.bowType, "col-40")}
        </div>
        <div class="row">
          ${renderField("Club / academy affiliation *", data.clubAffiliation, "col-55")}
          ${renderField("Years of competitive experience *", data.experienceYears, "col-45")}
        </div>

        <!-- Section 3 -->
        <div class="section-title">3. Completed attempt details</div>
        <div class="row">
          ${renderField("Record category claimed *", data.recordCategory || submission.recordCategory, "col-60")}
          ${renderField("Distance / score / value achieved *", data.achievedResult || submission.achievedResult, "col-40")}
        </div>
        <div class="row">
          ${renderField("Date attempt took place (DD/MM/YYYY) *", formatDate(data.attemptDate || submission.attemptDate), "col-40")}
          ${renderField("Location / venue *", data.venue || submission.venue, "col-60")}
        </div>
        <div class="row">
          ${renderField("Existing record being challenged (if any)", data.existingRecord, "col-60")}
          ${renderField("Current record value", data.currentRecordValue, "col-40")}
        </div>
        <div class="row">
          ${renderField("Officials / judges present at the time (if any)", data.officiatingBody, "col-60")}
          ${renderField("Number of witnesses present *", data.witnessCount, "col-40")}
        </div>
        <div class="row">
          ${renderField("Equipment / device details *", data.equipmentDetails, "col-100")}
        </div>

        <div class="footer-text">
          <span>Archery Book of World Records — Official record attempt claim</span>
          <span>Page 1 of 2</span>
        </div>
      </div>

      <!-- PAGE 2 -->
      <div class="page">
        <div class="header">
          <div class="logo-box">LOGO</div>
          <div class="header-titles">
            <div class="org-title">Archery Book of World Records</div>
            <div class="doc-subtitle">Completed record attempt – claim form</div>
          </div>
          <div class="page-indicator">
            Page 2 of 2<br>Evidence, approvals & declaration
          </div>
        </div>

        <!-- Section 4 -->
        <div class="section-title">4. Evidence of attempt (mandatory – claim reviewed against official rules)</div>
        <div class="checkbox-grid" style="margin-bottom: 12px;">
          ${renderCheckbox("Video evidence attached", !!data.evidenceVideo)}
          ${renderCheckbox("Photo evidence attached", !!data.evidencePhoto)}
          ${renderCheckbox("Official scorecards attached", !!data.evidenceScorecard)}
          ${renderCheckbox("Witness statements attached", !!data.evidenceWitness)}
          ${renderCheckbox("Equipment certification attached", !!data.evidenceEquipment)}
          ${renderCheckbox("Third-party verification attached", !!data.evidenceThirdParty)}
        </div>
        <div class="row">
          ${renderField("Description of video / photo evidence (file name, source, timestamp)", data.evidenceDescription, "col-100")}
        </div>
        <div class="row">
          ${renderField("Third-party verification body (if any)", data.thirdPartyBody, "col-55")}
          ${renderField("Verification reference / certificate no.", data.thirdPartyRef, "col-45")}
        </div>

        <!-- Section 5 -->
        <div class="section-title">5. Parent / legal guardian approval (mandatory)</div>
        <div class="row">
          ${renderField("Parent / guardian full name *", data.parentName, "col-65")}
          ${renderField("Relationship to claimant *", data.parentRelationship, "col-35")}
        </div>
        <div style="font-size: 9px; color: #555; margin-bottom: 8px;">I confirm that I am the parent / legal guardian of the applicant and support this record attempt claim.</div>
        <div class="row">
          ${renderField("Parent / guardian signature *", "", "col-65")}
          ${renderField("Date *", "", "col-35")}
        </div>

        <!-- Section 6 -->
        <div class="section-title">6. School / institution approval (mandatory)</div>
        <div class="row">
          ${renderField("Institution / school name *", data.schoolName, "col-55")}
          ${renderField("Authorized official name *", data.schoolOfficialName, "col-45")}
        </div>
        <div style="font-size: 9px; color: #555; margin-bottom: 8px;">On behalf of the institution named above, I support this claimant's record attempt claim described herein.</div>
        <div class="row" style="position: relative;">
          <div class="stamp-area" style="position: absolute; right: 0; bottom: 0;">Stamp area</div>
          ${renderField("Authorized official signature *", "", "col-45")}
          ${renderField("Date *", "", "col-25")}
        </div>

        <!-- Section 7 -->
        <div class="section-title">7. Witness or coach approval (mandatory – select one)</div>
        <div style="display: flex; gap: 20px; margin-bottom: 8px;">
          ${renderCheckbox("Independent witness present at the attempt", data.witnessApprovalType === "witness")}
          ${renderCheckbox("Coach who supervised / trained the claimant", data.witnessApprovalType === "coach")}
        </div>
        <div class="row">
          ${renderField("Full name *", data.witnessApproverName, "col-60")}
          ${renderField("Relationship / role *", data.witnessApproverRelationship, "col-40")}
        </div>
        <div style="font-size: 9px; color: #555; margin-bottom: 8px;">I confirm that I witnessed / supervised this record attempt and the details described are accurate.</div>
        <div class="row">
          ${renderField("Witness / coach signature *", "", "col-65")}
          ${renderField("Date *", "", "col-35")}
        </div>

        <!-- Section 8 -->
        <div class="section-title">8. Claimant declaration</div>
        <div style="font-size: 9px; color: #555; margin-bottom: 8px; text-align: justify;">
          I declare that the information and evidence provided in this claim are true, accurate, and complete to the best of my
          knowledge, and approval is subject to the official verification rules & procedures of the Archery Book of Records.
        </div>
        <div class="row">
          ${renderField("Claimant signature *", "", "col-65")}
          ${renderField("Date *", "", "col-35")}
        </div>

        <!-- Office Use Box -->
        <div class="office-use-box">
          <div class="office-use-title">FOR OFFICE USE ONLY</div>
          <div class="row" style="margin-bottom: 0;">
            ${renderField("Claim ID:", submission.id, "col-25")}
            ${renderField("Received by:", "", "col-25")}
            ${renderField("Evidence sufficiency:", "", "col-25")}
            ${renderField("Reviewer name:", "", "col-25")}
          </div>
          <div class="row" style="margin-top: 8px; margin-bottom: 0;">
            ${renderField("Verification status:", submission.status, "col-50")}
            ${renderField("Date reviewed:", "", "col-50")}
          </div>
        </div>

        <div class="footer-text">
          <span>Archery Book of World Records — Official record attempt claim</span>
          <span>Page 2 of 2</span>
        </div>
      </div>
    `;
  } else if (category === "organization") {
    // ORGANISATION APPLICATION FORM PDF
    filename = `Archery_Record_Application_Form_Organisations_${submission.id}.pdf`;
    htmlContent = `
      <!-- PAGE 1 -->
      <div class="page">
        <div class="header">
          <div class="logo-box">LOGO</div>
          <div class="header-titles">
            <div class="org-title">Archery Book of World Records</div>
            <div class="doc-subtitle">Record attempt application form – organisations</div>
          </div>
          <div class="page-indicator">
            Page 1 of 3<br>Organisation details & attempt type
          </div>
        </div>

        <div style="font-size: 8px; color: #555; margin-bottom: 5px; text-align: right;">* indicates a mandatory field</div>

        <!-- Section 1 -->
        <div class="section-title">1. Organisation details</div>
        <div class="row">
          ${renderField("Organisation / federation / club name *", data.orgName || submission.orgName, "col-55")}
          ${renderField("Entity type (Federation / Club / Academy / Company / Other) *", data.orgType || submission.orgType, "col-45")}
        </div>
        <div class="row">
          ${renderField("Registration / legal entity number *", data.orgRegNumber, "col-50")}
          ${renderField("Country of registration *", data.orgCountry, "col-50")}
        </div>
        <div class="row">
          ${renderField("Head office address *", data.orgAddress, "col-100")}
        </div>
        <div class="row">
          ${renderField("City *", data.orgCity, "col-35")}
          ${renderField("State / Province *", data.orgState, "col-35")}
          ${renderField("Postal code *", data.orgPostalCode, "col-30")}
        </div>
        <div class="row">
          ${renderField("Authorized contact person *", data.orgContactPerson || submission.repName, "col-55")}
          ${renderField("Designation / title *", data.orgContactDesignation, "col-45")}
        </div>
        <div class="row">
          ${renderField("Contact email address *", data.orgContactEmail || submission.email, "col-55")}
          ${renderField("Contact phone number *", data.orgContactPhone || submission.phone, "col-45")}
        </div>

        <!-- Section 2 -->
        <div class="section-title">2. Type of record attempt</div>
        <div style="display: flex; gap: 30px; margin-bottom: 5px;">
          ${renderCheckbox("Individual record attempt (submitted on behalf of one archer)", data.orgAttemptType === "individual")}
          ${renderCheckbox("Team / group record attempt", data.orgAttemptType === "team")}
        </div>
        <div style="font-size: 9px; color: #666; font-style: italic; margin-bottom: 12px;">
          If individual, complete Section 3A on page 2. If team / group, complete the roster in Section 3B on page 2.
        </div>

        <!-- Section 3 -->
        <div class="section-title">3. Record attempt details</div>
        <div class="row">
          ${renderField("Record category being attempted *", data.recordCategory || submission.recordCategory, "col-60")}
          ${renderField("Target distance *", data.targetDistance, "col-40")}
        </div>
        <div class="row">
          ${renderField("Date of attempt (DD/MM/YYYY) *", formatDate(data.attemptDate || submission.attemptDate), "col-40")}
          ${renderField("Location / venue *", data.venue || submission.venue, "col-60")}
        </div>
        <div class="row">
          ${renderField("Existing record being challenged (if any)", data.existingRecord, "col-60")}
          ${renderField("Current record value", data.currentRecordValue, "col-40")}
        </div>
        <div class="row">
          ${renderField("Officiating body / judges present *", data.officiatingBody, "col-60")}
          ${renderField("Number of witnesses *", data.witnessCount, "col-40")}
        </div>

        <div class="footer-text">
          <span>Archery Book of World Records — Official organisation record attempt application</span>
          <span>Page 1 of 3</span>
        </div>
      </div>

      <!-- PAGE 2 -->
      <div class="page">
        <div class="header">
          <div class="logo-box">LOGO</div>
          <div class="header-titles">
            <div class="org-title">Archery Book of World Records</div>
            <div class="doc-subtitle">Record attempt application form – organisations</div>
          </div>
          <div class="page-indicator">
            Page 2 of 3<br>Participants & evidence
          </div>
        </div>

        <!-- Section 3A -->
        <div class="section-title">3A. Individual applicant details (complete if individual attempt)</div>
        <div class="row">
          ${renderField("Full legal name", data.orgAttemptType === "individual" ? data.orgIndName : "", "col-65")}
          ${renderField("Date of birth (DD/MM/YYYY)", data.orgAttemptType === "individual" ? formatDate(data.orgIndDob) : "", "col-35")}
        </div>
        <div class="row">
          ${renderField("Gender", data.orgAttemptType === "individual" ? data.orgIndGender : "", "col-30")}
          ${renderField("Nationality", data.orgAttemptType === "individual" ? data.orgIndNationality : "", "col-35")}
          ${renderField("Age category (Junior / Senior / Veteran)", data.orgAttemptType === "individual" ? data.orgIndAgeCategory : "", "col-35")}
        </div>
        <div class="row">
          ${renderField("Discipline (Recurve / Compound / Traditional / Para-archery)", data.orgAttemptType === "individual" ? data.orgIndDiscipline : "", "col-60")}
          ${renderField("Bow type", data.orgAttemptType === "individual" ? data.orgIndBowType : "", "col-40")}
        </div>

        <!-- Section 3B -->
        <div class="section-title">3B. Team / group roster (complete if team / group attempt)</div>
        <table class="table">
          <thead>
            <tr>
              <th style="width: 5%">#</th>
              <th style="width: 35%">Full name *</th>
              <th style="width: 25%">Role (Shooter / Captain / Alternate) *</th>
              <th style="width: 15%">Age category</th>
              <th style="width: 20%">Discipline</th>
            </tr>
          </thead>
          <tbody>
            ${[0, 1, 2, 3, 4].map(idx => {
              const member = data.orgAttemptType === "team" && data.teamRoster && data.teamRoster[idx] ? data.teamRoster[idx] : {};
              return `
                <tr>
                  <td>${idx + 1}</td>
                  <td><b>${member.fullName || ""}</b></td>
                  <td>${member.role || ""}</td>
                  <td>${member.ageCategory || ""}</td>
                  <td>${member.discipline || ""}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>

        <div style="font-size: 9px; color: #555; margin-bottom: 5px;">List all timing, scoring, or measurement equipment used during the attempt:</div>
        <div class="row">
          ${renderField("Equipment / device details *", data.equipmentDetails, "col-100")}
        </div>

        <!-- Section 4 -->
        <div class="section-title">4. Supporting evidence checklist</div>
        <div class="checkbox-grid">
          ${renderCheckbox("Video evidence attached", !!data.evidenceVideo)}
          ${renderCheckbox("Photo evidence attached", !!data.evidencePhoto)}
          ${renderCheckbox("Official scorecards attached", !!data.evidenceScorecard)}
          ${renderCheckbox("Witness statements attached", !!data.evidenceWitness)}
          ${renderCheckbox("Equipment certification attached", !!data.evidenceEquipment)}
        </div>

        <div class="footer-text">
          <span>Archery Book of World Records — Official organisation record attempt application</span>
          <span>Page 2 of 3</span>
        </div>
      </div>

      <!-- PAGE 3 -->
      <div class="page">
        <div class="header">
          <div class="logo-box">LOGO</div>
          <div class="header-titles">
            <div class="org-title">Archery Book of World Records</div>
            <div class="doc-subtitle">Record attempt application form – organisations</div>
          </div>
          <div class="page-indicator">
            Page 3 of 3<br>Approvals & declaration
          </div>
        </div>

        <div class="banner">
          This application is submitted by the organisation named on page 1, which acts as the approving authority for
          this record attempt. Approval by the Archery Book of Records is subject to its official verification rules &
          procedures and is not guaranteed by submission alone.
        </div>

        <!-- Section 5 -->
        <div class="section-title">5. Organisation authorised representative (mandatory)</div>
        <div class="row">
          ${renderField("Representative full name *", data.orgRepName, "col-60")}
          ${renderField("Designation / title *", data.orgRepDesignation, "col-40")}
        </div>
        <div style="font-size: 9px; color: #555; margin-bottom: 8px;">On behalf of the organisation named on page 1, I approve and take responsibility for this record attempt application.</div>
        <div class="row" style="position: relative;">
          <div class="stamp-area" style="position: absolute; right: 0; bottom: 0;">Stamp area</div>
          ${renderField("Authorised representative signature *", "", "col-45")}
          ${renderField("Date *", "", "col-25")}
        </div>

        <!-- Section 6 -->
        <div class="section-title">6. Witnessing official (mandatory)</div>
        <div class="row">
          ${renderField("Witnessing official full name *", data.orgWitnessName, "col-60")}
          ${renderField("Designation / role *", data.orgWitnessDesignation, "col-40")}
        </div>
        <div style="font-size: 9px; color: #555; margin-bottom: 8px;">I confirm that I witnessed this record attempt and the details described are accurate.</div>
        <div class="row">
          ${renderField("Witnessing official signature *", "", "col-65")}
          ${renderField("Date *", "", "col-35")}
        </div>

        <!-- Section 7 -->
        <div class="section-title">7. Declaration</div>
        <div style="font-size: 9px; color: #555; margin-bottom: 8px;">We declare that the information provided in this application is true, accurate, and complete to the best of our knowledge, on behalf of the organisation named herein.</div>
        <div class="row">
          ${renderField("Authorised representative signature (repeat) *", "", "col-65")}
          ${renderField("Date *", "", "col-35")}
        </div>

        <!-- Office Use Box -->
        <div class="office-use-box">
          <div class="office-use-title">FOR OFFICE USE ONLY</div>
          <div class="row" style="margin-bottom: 0;">
            ${renderField("Application ID:", submission.id, "col-25")}
            ${renderField("Received by:", "", "col-25")}
            ${renderField("Verification status:", submission.status, "col-25")}
            ${renderField("Date received:", "", "col-25")}
          </div>
          <div class="row" style="margin-top: 8px; margin-bottom: 0;">
            ${renderField("Attempt type confirmed:", data.orgAttemptType, "col-50")}
            ${renderField("Reviewer name:", "", "col-50")}
          </div>
        </div>

        <div class="footer-text">
          <span>Archery Book of World Records — Official organisation record attempt application</span>
          <span>Page 3 of 3</span>
        </div>
      </div>
    `;
  } else {
    // INDIVIDUAL APPLICATION FORM PDF
    filename = `Archery_Record_Application_Form_${submission.id}.pdf`;
    htmlContent = `
      <!-- PAGE 1 -->
      <div class="page">
        <div class="header">
          <div class="logo-box">LOGO</div>
          <div class="header-titles">
            <div class="org-title">Archery Book of World Records</div>
            <div class="doc-subtitle">Record attempt application form</div>
          </div>
          <div class="page-indicator">
            Page 1 of 2<br>Applicant & record attempt details
          </div>
        </div>

        <div style="font-size: 8px; color: #555; margin-bottom: 5px; text-align: right;">* indicates a mandatory field</div>

        <!-- Section 1 -->
        <div class="section-title">1. Applicant information</div>
        <div class="row">
          ${renderField("Full legal name *", data.name || submission.name, "col-65")}
          ${renderField("Date of birth (DD/MM/YYYY) *", formatDate(data.dob || submission.dob), "col-35")}
        </div>
        <div class="row">
          ${renderField("Gender *", data.gender, "col-30")}
          ${renderField("Nationality *", data.nationality, "col-35")}
          ${renderField("Age category (Junior / Senior / Veteran) *", data.ageCategory, "col-35")}
        </div>
        <div class="row">
          ${renderField("Residential address *", data.address, "col-100")}
        </div>
        <div class="row">
          ${renderField("City *", data.city, "col-35")}
          ${renderField("State / Province *", data.state, "col-35")}
          ${renderField("Postal code *", data.postalCode, "col-30")}
        </div>
        <div class="row">
          ${renderField("Email address *", data.email || submission.email, "col-55")}
          ${renderField("Phone number *", data.phone || submission.phone, "col-45")}
        </div>

        <!-- Section 2 -->
        <div class="section-title">2. Archery profile</div>
        <div class="row">
          ${renderField("Discipline (Recurve / Compound / Traditional / Para-archery) *", data.discipline, "col-60")}
          ${renderField("Bow type *", data.bowType, "col-40")}
        </div>
        <div class="row">
          ${renderField("Club / academy affiliation *", data.clubAffiliation, "col-55")}
          ${renderField("Years of competitive experience *", data.experienceYears, "col-45")}
        </div>
        <div class="row">
          ${renderField("Coach name (if applicable)", data.coachName, "col-55")}
          ${renderField("National federation ID (if any)", data.federationId, "col-45")}
        </div>

        <!-- Section 3 -->
        <div class="section-title">3. Record attempt details</div>
        <div class="row">
          ${renderField("Record category being attempted *", data.recordCategory || submission.recordCategory, "col-60")}
          ${renderField("Target distance *", data.targetDistance, "col-40")}
        </div>
        <div class="row">
          ${renderField("Date of attempt (DD/MM/YYYY) *", formatDate(data.attemptDate || submission.attemptDate), "col-40")}
          ${renderField("Location / venue *", data.venue || submission.venue, "col-60")}
        </div>
        <div class="row">
          ${renderField("Existing record being challenged (if any)", data.existingRecord, "col-60")}
          ${renderField("Current record value", data.currentRecordValue, "col-40")}
        </div>
        <div class="row">
          ${renderField("Officiating body / judges present *", data.officiatingBody, "col-60")}
          ${renderField("Number of witnesses *", data.witnessCount, "col-40")}
        </div>
        <div style="font-size: 9px; color: #555; margin-bottom: 5px;">List all timing, scoring, or measurement equipment used to verify the attempt:</div>
        <div class="row">
          ${renderField("Equipment / device details *", data.equipmentDetails, "col-100")}
        </div>

        <!-- Section 4 -->
        <div class="section-title">4. Supporting evidence checklist</div>
        <div class="checkbox-grid">
          ${renderCheckbox("Video evidence attached", !!data.evidenceVideo)}
          ${renderCheckbox("Photo evidence attached", !!data.evidencePhoto)}
          ${renderCheckbox("Official scorecards attached", !!data.evidenceScorecard)}
          ${renderCheckbox("Witness statements attached", !!data.evidenceWitness)}
          ${renderCheckbox("Equipment certification attached", !!data.evidenceEquipment)}
        </div>

        <div class="footer-text">
          <span>Archery Book of World Records — Official record attempt application</span>
          <span>Page 1 of 2</span>
        </div>
      </div>

      <!-- PAGE 2 -->
      <div class="page">
        <div class="header">
          <div class="logo-box">LOGO</div>
          <div class="header-titles">
            <div class="org-title">Archery Book of World Records</div>
            <div class="doc-subtitle">Record attempt application form</div>
          </div>
          <div class="page-indicator">
            Page 2 of 2<br>Approvals & declaration
          </div>
        </div>

        <div style="font-size: 9px; color: #666; font-style: italic; margin-bottom: 12px;">
          Both parent/guardian and school/institution approval sections below are mandatory for this application.
        </div>

        <!-- Section 5 -->
        <div class="section-title">5. Parent / legal guardian approval (mandatory)</div>
        <div class="row">
          ${renderField("Parent / guardian full name *", data.parentName, "col-65")}
          ${renderField("Relationship to applicant *", data.parentRelationship, "col-35")}
        </div>
        <div class="row">
          ${renderField("Contact phone number *", data.parentPhone, "col-50")}
          ${renderField("Contact email address *", data.parentEmail, "col-50")}
        </div>
        <div style="font-size: 9px; color: #555; margin-bottom: 8px;">I confirm that I am the parent / legal guardian of the applicant and consent to this record attempt application.</div>
        <div class="row">
          ${renderField("Parent / guardian signature *", "", "col-65")}
          ${renderField("Date *", "", "col-35")}
        </div>

        <!-- Section 6 -->
        <div class="section-title">6. School / institution approval (mandatory)</div>
        <div class="row">
          ${renderField("Institution / school name *", data.schoolName, "col-55")}
          ${renderField("Institution registration / ID number", data.schoolRegId, "col-45")}
        </div>
        <div class="row">
          ${renderField("Authorized official name *", data.schoolOfficialName, "col-60")}
          ${renderField("Designation / title *", data.schoolOfficialDesignation, "col-40")}
        </div>
        <div style="font-size: 9px; color: #555; margin-bottom: 8px;">On behalf of the institution named above, I approve this applicant's participation in the record attempt described herein.</div>
        <div class="row" style="position: relative;">
          <div class="stamp-area" style="position: absolute; right: 0; bottom: 0;">Stamp area</div>
          ${renderField("Authorized official signature *", "", "col-45")}
          ${renderField("Date *", "", "col-25")}
        </div>

        <!-- Section 7 -->
        <div class="section-title">7. Applicant declaration</div>
        <div style="font-size: 9px; color: #555; margin-bottom: 8px;">I declare that the information provided in this application is true, accurate, and complete to the best of my knowledge.</div>
        <div class="row">
          ${renderField("Applicant signature *", "", "col-65")}
          ${renderField("Date *", "", "col-35")}
        </div>

        <!-- Office Use Box -->
        <div class="office-use-box">
          <div class="office-use-title">FOR OFFICE USE ONLY</div>
          <div class="row" style="margin-bottom: 0;">
            ${renderField("Application ID:", submission.id, "col-25")}
            ${renderField("Received by:", "", "col-25")}
            ${renderField("Verification status:", submission.status, "col-25")}
            ${renderField("Date received:", "", "col-25")}
          </div>
        </div>

        <div class="footer-text">
          <span>Archery Book of World Records — Official record attempt application</span>
          <span>Page 2 of 2</span>
        </div>
      </div>
    `;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to download the PDF form.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @media print {
            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .page {
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
              page-break-after: always;
            }
            .page:last-child {
              page-break-after: avoid;
            }
          }
          body {
            font-family: 'Arial', sans-serif;
            color: #3d3a33;
            line-height: 1.35;
            background-color: #f7f7f7;
            padding: 20px;
            margin: 0;
          }
          .page {
            background-color: #ffffff;
            width: 210mm;
            min-height: 297mm;
            padding: 15mm 20mm;
            margin: 0 auto 30px auto;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            border: 1px solid #ddd;
            box-sizing: border-box;
            position: relative;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #bda25c;
            padding-bottom: 12px;
            margin-bottom: 15px;
          }
          .logo-box {
            border: 1px solid #777;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: monospace;
            font-size: 9px;
            color: #777;
            font-weight: bold;
          }
          .header-titles {
            flex-grow: 1;
            margin-left: 15px;
          }
          .org-title {
            font-size: 20px;
            font-weight: bold;
            color: #0c2b2b;
          }
          .doc-subtitle {
            font-size: 12px;
            color: #555;
            margin-top: 2px;
          }
          .page-indicator {
            font-size: 8.5px;
            color: #666;
            text-align: right;
            line-height: 1.3;
          }
          .banner {
            border: 1px solid #bda25c;
            background-color: #fdfcf9;
            padding: 8px 12px;
            font-size: 9.5px;
            color: #555;
            margin-bottom: 15px;
            text-align: justify;
            line-height: 1.4;
          }
          .section-title {
            background-color: #f2ede1;
            color: #3d3a33;
            padding: 5px 8px;
            font-weight: bold;
            font-size: 11px;
            margin-top: 15px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .row {
            display: flex;
            margin-bottom: 10px;
            gap: 15px;
            width: 100%;
          }
          .col {
            display: flex;
            flex-direction: column;
          }
          .col-100 { width: 100%; }
          .col-75 { width: 75%; }
          .col-70 { width: 70%; }
          .col-65 { width: 65%; }
          .col-60 { width: 60%; }
          .col-55 { width: 55%; }
          .col-50 { width: 50%; }
          .col-45 { width: 45%; }
          .col-40 { width: 40%; }
          .col-35 { width: 35%; }
          .col-30 { width: 30%; }
          .col-25 { width: 25%; }
          .col-20 { width: 20%; }

          .field-label {
            font-size: 8.5px;
            color: #666;
            margin-bottom: 2px;
          }
          .field-value {
            border-bottom: 1px solid #999;
            padding-bottom: 2px;
            font-size: 11.5px;
            font-weight: bold;
            color: #000;
            min-height: 14px;
          }
          .checkbox-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 5px;
          }
          .checkbox-item {
            display: flex;
            align-items: center;
            font-size: 10px;
          }
          .checkbox-box {
            width: 12px;
            height: 12px;
            border: 1px solid #333;
            margin-right: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            font-weight: bold;
            flex-shrink: 0;
          }
          .footer-text {
            position: absolute;
            bottom: 15mm;
            left: 20mm;
            right: 20mm;
            display: flex;
            justify-content: space-between;
            font-size: 8px;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 5px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-bottom: 15px;
          }
          .table th, .table td {
            border: 1px solid #bbb;
            padding: 5px 6px;
            text-align: left;
            font-size: 10px;
          }
          .table th {
            background-color: #f2ede1;
            font-weight: bold;
          }
          .office-use-box {
            border: 1px solid #bbb;
            background-color: #fbfaf7;
            padding: 8px 10px;
            margin-top: 20px;
          }
          .office-use-title {
            font-weight: bold;
            font-size: 8.5px;
            color: #555;
            text-transform: uppercase;
            margin-bottom: 6px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 2px;
          }
          .stamp-area {
            border: 1px dashed #999;
            width: 90px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8.5px;
            color: #777;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
