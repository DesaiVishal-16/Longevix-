import { useAuth } from "@/src/contexts/auth.context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");


const responsiveSize = (size: number, factor: number = 1) =>
  Math.min(size, SCREEN_WIDTH * factor);

const responsiveHeight = (size: number, factor: number = 1) =>
  Math.min(size, SCREEN_HEIGHT * factor);


interface OnboardingSlide {
  id: string;
  icon?: keyof typeof FontAwesome6.glyphMap;
  title: string;
  subtitle?: string;
  description?: string;
  colors: readonly [string, string];
  type: "icon" | "nutrition" | "gender" | "disclaimer";
}

interface SlideContentProps {
  slide: OnboardingSlide;
  index: number;
}


const SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    icon: "bowl-rice",
    title: "The Problem",
    subtitle: "Calories alone dont tell full story",
    description:
      "Discover the power of nutrition tracking beyond simple calorie counting",
    colors: ["#E8F2FE", "#FFFFFF"],
    type: "icon",
  },
  {
    id: "2",
    title: "The Solution",
    subtitle: "Track vitamins & minerals easily",
    colors: ["#E7FCF2", "#FFFFFF"],
    type: "nutrition",
  },
  {
    id: "3",
    title: "Personalised",
    subtitle: "Tailored for your age & goals",
    colors: ["#F9F3FF", "#FFFFFF"],
    type: "gender",
  },
  {
    id: "4",
    icon: "exclamation",
    title: "Important Disclaimer",
    description: "By continuing, you agree to our Terms & Privacy Policy",
    colors: ["#FFFAE7", "#FFFFFF"],
    type: "disclaimer",
  },
];

// ============================================================================

const NUTRITION_DATA = [
  { label: "Vitamin A", percentage: 95, color: "#4CAF50" },
  { label: "Iron", percentage: 68, color: "#FF9800" },
];


const IconContent: React.FC<{ icon: keyof typeof FontAwesome6.glyphMap }> = ({
  icon,
}) => (
  <View style={styles.iconContainer}>
    <View style={styles.iconOuter}>
      <View style={styles.iconInner}>
        <FontAwesome6
          name={icon}
          size={responsiveSize(56, 0.12)}
          color="#2E7D32"
        />
      </View>
    </View>
  </View>
);


const NutritionContent: React.FC = () => (
  <View style={styles.nutritionCardsContainer}>
    {NUTRITION_DATA.map((item) => (
      <View key={item.label} style={styles.nutritionCard}>
        <View style={styles.cardContent}>
          <Text style={styles.nutritionLabel}>{item.label}</Text>
          <Text style={[styles.nutritionPercentage, { color: item.color }]}>
            {item.percentage}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              },
            ]}
          />
        </View>
      </View>
    ))}
  </View>
);


const GenderContent: React.FC = () => (
  <View style={styles.genderCardsContainer}>
    <View style={styles.genderCard}>
      <FontAwesome6
        name="mars"
        size={responsiveSize(40, 0.1)}
        color="#2196F3"
      />
    </View>
    <View style={styles.genderCard}>
      <FontAwesome6
        name="venus"
        size={responsiveSize(40, 0.1)}
        color="#E91E63"
      />
    </View>
  </View>
);


const DisclaimerContent: React.FC = () => (
  <View style={styles.disclaimerContainer}>
    <View style={styles.disclaimerIconCircle}>
      <FontAwesome6
        name="exclamation"
        size={responsiveSize(40, 0.08)}
        color="#fff"
      />
    </View>
    <View style={styles.disclaimerCard}>
      <Text style={styles.disclaimerText}>
        This app provides nutritional insights, not medical advice, consult
        healthcare professional for personalized guidance
      </Text>
    </View>
  </View>
);


const SlideContent: React.FC<SlideContentProps> = ({ slide, index }) => {
  const renderContent = () => {
    switch (slide.type) {
      case "icon":
        return slide.icon ? <IconContent icon={slide.icon} /> : null;
      case "nutrition":
        return <NutritionContent />;
      case "gender":
        return <GenderContent />;
      case "disclaimer":
        return <DisclaimerContent />;
      default:
        return null;
    }
  };

  const showTitleSubtitle = slide.type !== "disclaimer";

  return (
    <>
      <View
        style={[
          styles.topContent,
          index === 0 && styles.topContentFirst,
          index === 1 && styles.topContentSecond,
          index === 3 && styles.topContentFourth,
        ]}
      >
        {renderContent()}

        {showTitleSubtitle && (
          <>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </>
        )}
      </View>

      {slide.description && (
        <View style={styles.bottomContent}>
          <Text style={styles.description}>{slide.description}</Text>
        </View>
      )}
    </>
  );
};


const PaginationDots: React.FC<{ currentIndex: number; total: number }> = ({
  currentIndex,
  total,
}) => (
  <View style={styles.paginationOverlay}>
    {Array.from({ length: total }).map((_, index) => (
      <View
        key={index}
        style={[styles.dot, index === currentIndex && styles.activeDot]}
      />
    ))}
  </View>
);


const Header: React.FC<{
  onBack: () => void;
  onSkip: () => void;
}> = ({ onBack, onSkip }) => (
  <View style={styles.headerOverlay}>
    <TouchableOpacity
      onPress={onBack}
      style={styles.headerButton}
      accessibilityLabel="Go back"
    >
      <FontAwesome6
        name="arrow-left"
        size={responsiveSize(24, 0.06)}
        color="#333"
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={onSkip} accessibilityLabel="Skip onboarding">
      <Text style={styles.skipText}>Skip</Text>
    </TouchableOpacity>
  </View>
);


const BottomCTA: React.FC<{
  isLastSlide: boolean;
  onPress: () => void;
}> = ({ isLastSlide, onPress }) => (
  <View style={styles.bottomContainer}>
    <TouchableOpacity
      style={styles.nextButton}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={isLastSlide ? "I understood, Continue" : "Continue"}
    >
      <Text style={styles.nextButtonText}>
        {isLastSlide ? "I understood, Continue" : "Continue"}
      </Text>
      <FontAwesome6
        name={isLastSlide ? "circle-check" : "arrow-right"}
        size={responsiveSize(20, 0.05)}
        color="#fff"
      />
    </TouchableOpacity>
  </View>
);

// ============================================================================

export default function OnboardingScreen() {
  const { setHasSeenWelcome } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  
  const isLastSlide = currentIndex === SLIDES.length - 1;

  
  const handleNext = useCallback(async () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      
      await setHasSeenWelcome();
      router.push("/(auth)/login");
    }
  }, [currentIndex, setHasSeenWelcome]);

  const handleSkip = useCallback(async () => {
    
    await setHasSeenWelcome();
    router.push("/(auth)/login");
  }, [setHasSeenWelcome]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToOffset({
        offset: prevIndex * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      router.back();
    }
  }, [currentIndex]);

  
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0]?.index !== null) {
        setCurrentIndex(viewableItems[0].index as number);
      }
    }
  ).current;

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 50,
    }),
    []
  );

  
  const renderSlide = useCallback(
    ({ item, index }: { item: OnboardingSlide; index: number }) => {
      const inputRange = [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
        extrapolate: "clamp",
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.5, 1, 0.5],
        extrapolate: "clamp",
      });

      const isDisclaimerSlide = item.type === "disclaimer";

      return (
        <View style={styles.slideContainer}>
          <LinearGradient
            colors={item.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.slide}
          >
            <Animated.View
              style={[
                styles.slideAnimatedContent,
                { transform: [{ scale }], opacity },
                isDisclaimerSlide && styles.slideDisclaimerContent,
              ]}
            >
              <SlideContent slide={item} index={index} />
            </Animated.View>
          </LinearGradient>
        </View>
      );
    },
    [scrollX]
  );

  
  const keyExtractor = useCallback((item: OnboardingSlide) => item.id, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatListContent}
      />

      <Header onBack={handleBack} onSkip={handleSkip} />

      <PaginationDots currentIndex={currentIndex} total={SLIDES.length} />

      <BottomCTA isLastSlide={isLastSlide} onPress={handleNext} />
    </>
  );
}

// ============================================================================
// Styles
// ============================================================================
const styles = StyleSheet.create({
  // Layout
  slideContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  slideAnimatedContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  slideDisclaimerContent: {
    justifyContent: "flex-start",
    paddingTop: responsiveHeight(60, 0.08),
  },
  flatListContent: {
    flexGrow: 1,
  },

  // Top Content
  topContent: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  topContentFirst: {
    paddingTop: 60,
  },
  topContentSecond: {
    paddingTop: 20,
  },
  topContentFourth: {
    paddingHorizontal: 20,
  },

  // Bottom Content
  bottomContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 100,
  },

  // Header
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    zIndex: 10,
  },
  headerButton: {
    padding: responsiveSize(8, 0.02),
  },
  skipText: {
    fontSize: responsiveSize(16, 0.04),
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.7)",
  },

  // Pagination
  paginationOverlay: {
    position: "absolute",
    bottom: responsiveHeight(120, 0.15),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    zIndex: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  activeDot: {
    backgroundColor: "#2E7D32",
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  // Bottom CTA
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    zIndex: 10,
  },
  nextButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: responsiveHeight(18, 0.025),
    paddingHorizontal: responsiveSize(24, 0.06),
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: responsiveSize(18, 0.045),
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Icon Content
  iconContainer: {
    alignItems: "center",
    marginBottom: responsiveSize(40, 0.08),
  },
  iconOuter: {
    width: responsiveSize(140, 0.3),
    height: responsiveSize(140, 0.3),
    borderRadius: responsiveSize(70, 0.15),
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveSize(30, 0.07),
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  iconInner: {
    width: responsiveSize(100, 0.22),
    height: responsiveSize(100, 0.22),
    borderRadius: responsiveSize(50, 0.11),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },

  // Typography
  title: {
    fontSize: responsiveSize(32, 0.08),
    fontWeight: "800",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: responsiveSize(16, 0.04),
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  description: {
    fontSize: responsiveSize(16, 0.04),
    color: "#555",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
    paddingHorizontal: 20,
  },

  // Nutrition Cards
  nutritionCardsContainer: {
    flexDirection: "column",
    gap: 16,
    marginBottom: responsiveSize(40, 0.08),
    width: "100%",
  },
  nutritionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  nutritionLabel: {
    fontSize: responsiveSize(16, 0.04),
    fontWeight: "600",
    color: "#333",
  },
  nutritionPercentage: {
    fontSize: responsiveSize(18, 0.045),
    fontWeight: "700",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },

  // Gender Cards
  genderCardsContainer: {
    flexDirection: "row",
    gap: 24,
    marginBottom: responsiveSize(40, 0.08),
  },
  genderCard: {
    width: responsiveSize(100, 0.22),
    height: responsiveSize(100, 0.22),
    borderRadius: responsiveSize(50, 0.11),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  // Disclaimer
  disclaimerContainer: {
    alignItems: "center",
    gap: 50,
  },
  disclaimerIconCircle: {
    width: responsiveSize(80, 0.18),
    height: responsiveSize(80, 0.18),
    borderRadius: responsiveSize(40, 0.09),
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  disclaimerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: "95%",
  },
  disclaimerText: {
    fontSize: responsiveSize(18, 0.045),
    color: "#333",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "500",
  },
});
