"use client";
import axios from "axios";
import { useState } from "react";

const Meeting = () => {
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const startMeeting = async () => {
    new Promise(async (resolve, reject) => {
      const ZoomMtgEmbedded = await (await import("@zoom/meetingsdk/embedded")).default;
      let client = ZoomMtgEmbedded.createClient();
      resolve(client);
    })
      .then(async (client) => {
        let meetingSDKElement = document.getElementById("meetingSDKElement");

        const { data } = await axios({
          url: "/api/Zoom",
          method: "post",
          data: {
            meetingNumber: meetingDetails.id,
          },
        })
          .then((response) => {
            return response;
          })
          .catch((error) => {
            console.log(error);
          });

        //console.log(data);

        let clientConfigObj = {
          meetingNumber: meetingDetails.id,
          signature: data.signature,
          sdkKey: data.sdkKey,
          userName: "Nikhil User",
          password: meetingDetails.password,
          tk: "",
          userEmail: "nikhil.bachhav@gmail.com",
        };

        console.log(clientConfigObj);

        client.init({
          zoomAppRoot: meetingSDKElement,
          language: "en-US",
          patchJsMedia: true,
        });

        client.join(clientConfigObj);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createMeeting = async () => {
    const { data } = await axios({
      url: "http://localhost:3000/meeting/create",
      method: "GET",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(data);

    setMeetingDetails({ ...data.data });
    setAuthToken(data.token);
  };

  return (
    <>
      <br />
      <button onClick={createMeeting}>Create Meeting</button>
      <br /> <br />
      <button onClick={startMeeting}>Start Meeting</button>
      <br /> <br />
      <div id="meetingSDKElement">Zoom Meeting SDK Rendered Here</div>
    </>
  );
};

Meeting.displayName = "Zoom Component View";

export default Meeting;
