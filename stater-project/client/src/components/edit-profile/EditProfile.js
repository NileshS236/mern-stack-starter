import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextareaFieldGroup from "../common/TextareaFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import InputGroup from "../common/InputGroup";
import { withRouter } from "react-router-dom";
import { createProfile, getCurrentProfile } from "../../actions/profileActions";
import isEmpty from "../../validations/is-empty";

const EditProfile = ({
  createProfile,
  getCurrentProfile,
  history,
  ...props
}) => {
  const [displaySocialInputs, setDisplaySocialInputs] = useState(false);
  const [handle, setHandle] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [skills, setSkills] = useState("");
  const [githubusername, setGithubusername] = useState("");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [errors, setErrors] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submit");

    const profileData = {
      handle,
      company,
      website,
      location,
      status,
      skills,
      githubusername,
      bio,
      twitter,
      facebook,
      linkedin,
      youtube,
      instagram,
    };

    createProfile(profileData, history);
  };

  useEffect(() => {
    getCurrentProfile();
  }, []);

  useEffect(() => {
    if (props.errors) {
      setErrors(props.errors);
    }

    if (props.profile.profile) {
      const profile = props.profile.profile;

      // Bring skills array back to CSV
      const skillsCSV = profile?.skills?.join(",");

      // If profile field doesnt exist, make empty string
      profile.company = !isEmpty(profile.company) ? profile.company : "";
      profile.website = !isEmpty(profile.website) ? profile.website : "";
      profile.location = !isEmpty(profile.location) ? profile.location : "";
      profile.githubusername = !isEmpty(profile.githubusername)
        ? profile.githubusername
        : "";
      profile.bio = !isEmpty(profile.bio) ? profile.bio : "";
      profile.social = !isEmpty(profile.social) ? profile.social : {};
      profile.twitter = !isEmpty(profile.social.twitter)
        ? profile.social.twitter
        : "";
      profile.facebook = !isEmpty(profile.social.facebook)
        ? profile.social.facebook
        : "";
      profile.linkedin = !isEmpty(profile.social.linkedin)
        ? profile.social.linkedin
        : "";
      profile.youtube = !isEmpty(profile.social.youtube)
        ? profile.social.youtube
        : "";
      profile.instagram = !isEmpty(profile.social.instagram)
        ? profile.social.instagram
        : "";

      // Set component fields state
      setHandle(profile.handle);
      setCompany(profile.company);
      setWebsite(profile.website);
      setLocation(profile.location);
      setStatus(profile.status);
      setSkills(skillsCSV);
      setGithubusername(profile.githubusername);
      setBio(profile.bio);
      setTwitter(profile.twitter);
      setFacebook(profile.facebook);
      setLinkedin(profile.linkedin);
      setYoutube(profile.youtube);
      setInstagram(profile.instagram);
    }
  }, [props.counter]);

  let socialInputs;

  if (displaySocialInputs) {
    socialInputs = (
      <div>
        <InputGroup
          placeholder="Twitter Profile URL"
          name="twitter"
          icon="fab fa-twitter"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          error={errors.twitter}
        />

        <InputGroup
          placeholder="Facebook Page URL"
          name="facebook"
          icon="fab fa-facebook"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          error={errors.facebook}
        />

        <InputGroup
          placeholder="Linkedin Profile URL"
          name="linkedin"
          icon="fab fa-linkedin"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          error={errors.linkedin}
        />

        <InputGroup
          placeholder="YouTube Channel URL"
          name="youtube"
          icon="fab fa-youtube"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          error={errors.youtube}
        />

        <InputGroup
          placeholder="Instagram Page URL"
          name="instagram"
          icon="fab fa-instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          error={errors.instagram}
        />
      </div>
    );
  }

  const options = [
    { label: "* Select Professional Status", value: 0 },
    { label: "Developer", value: "Developer" },
    { label: "Junior Developer", value: "Junior Developer" },
    { label: "Senior Developer", value: "Senior Developer" },
    { label: "Manager", value: "Manager" },
    { label: "Student or Learning", value: "Student or Learning" },
    { label: "Instructor or Teacher", value: "Instructor or Teacher" },
    { label: "Intern", value: "Intern" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div className="create-profile">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Create Your Profile</h1>
            <p className="lead text-center">
              Let's get some information to make your profile stand out ❕
            </p>
            <small className="d-block pb-3">* = required fields</small>
            <form onSubmit={onSubmit}>
              <TextFieldGroup
                placeholder="Profile Handle"
                name="handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                error={errors.handle}
                info="A UNIQUE handle for your profile URL."
              />
              <SelectListGroup
                placeholder="Status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={options}
                error={errors.status}
                info="Give us an idea of where you are at in your career"
              />
              <TextFieldGroup
                placeholder="Company"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                error={errors.company}
                info="Could be your own company or one you work for"
              />
              <TextFieldGroup
                placeholder="Website"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                error={errors.website}
                info="Could be your own website or a company one"
              />
              <TextFieldGroup
                placeholder="Location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                error={errors.location}
                info="City or city & state suggested (eg. Boston, MA)"
              />
              <TextFieldGroup
                placeholder="* Skills"
                name="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                error={errors.skills}
                info="Please use comma separated values (eg.
                    HTML,CSS,JavaScript,PHP"
              />
              <TextFieldGroup
                placeholder="Github Username"
                name="githubusername"
                value={githubusername}
                onChange={(e) => setGithubusername(e.target.value)}
                error={errors.githubusername}
                info="If you want your latest repos and a Github link, include your username"
              />
              <TextareaFieldGroup
                placeholder="Short Bio"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                error={errors.bio}
                info="Tell us a little about yourself"
              />

              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => setDisplaySocialInputs(!displaySocialInputs)}
                  className="btn btn-light"
                >
                  Add Social Network Links
                </button>
                <span className="text-muted">Optional</span>
              </div>
              {socialInputs}
              <input
                type="submit"
                value="Submit"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

EditProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(EditProfile)
);
