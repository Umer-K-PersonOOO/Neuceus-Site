import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { ExternalLink } from "./ExternalLink";
import { MonoText } from "./StyledText";
import { Text, View } from "./Themed";
import Colors from "@/constants/Colors";

interface Timings {
  Asr: string;
  Dhuhr: string;
  Fajr: string;
  Imsak: string;
  Isha: string;
  Maghrib: string;
  Midnight: string;
  Sunrise: string;
  Sunset: string;
  Firstthird: string;
  Lastthird: string;
}

interface ApiResponse {
  code: number;
  data: {
    timings: Timings;
  };
  status: string;
}

export default function EditScreenInfo({ path }: { path: string }) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function convertTo12Hour(timeStr: string): string {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hoursNumeric = parseInt(hours, 10);
    const suffix = hoursNumeric >= 12 ? "PM" : "AM";
    const hoursIn12 = hoursNumeric % 12 || 12; // Handles the case of 0 hours, which should be 12 AM
    return `${hoursIn12}:${minutes} ${suffix}`;
  }

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://api.aladhan.com/v1/timingsByAddress?address=1906 Nueces St, Austin, TX 78705"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json: ApiResponse = await response.json();
      setData(json); // Only setting the 'data' portion to state
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <View>
        {data?.data?.timings ? (
          <View>
            <Text>Prayer Timings:</Text>
            <Text>Fajr: {convertTo12Hour(data.data.timings.Fajr)}</Text>
            <Text>Dhuhr: {convertTo12Hour(data.data.timings.Dhuhr)}</Text>
            <Text>Asr: {convertTo12Hour(data.data.timings.Asr)}</Text>
            <Text>Maghrib: {convertTo12Hour(data.data.timings.Maghrib)}</Text>
            <Text>Isha: {convertTo12Hour(data.data.timings.Isha)}</Text>
            <Text>Sunrise: {convertTo12Hour(data.data.timings.Sunrise)}</Text>
            <Text>Sunset: {convertTo12Hour(data.data.timings.Sunset)}</Text>
            <Text>Midnight: {convertTo12Hour(data.data.timings.Midnight)}</Text>
          </View>
        ) : (
          <Text>No data fetched or incomplete data received</Text>
        )}
      </View>

      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Open up the code for this screen:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)"
        >
          <MonoText>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Change any of the text, save the file, and your app will automatically
          update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet"
        >
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making
            changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
});
