import { useTranslations } from "next-intl";
import { PolicyBulletList, PolicyContactBlock, PolicyPage, PolicySection, PolicyText } from "@/components/policy-page";

export default function MediaPolicyPage() {
  const t = useTranslations("MediaPolicy");

  return (
    <PolicyPage heading={t("heading")} intro={t("intro")}>
      <PolicySection heading={t("section1Heading")}>
        <PolicyText>{t("section1Body")}</PolicyText>
      </PolicySection>

      <PolicySection heading={t("section2Heading")}>
        <PolicyText>{t("section2Intro")}</PolicyText>
        <div className="p-4">
          <PolicyBulletList items={t.raw("section2Items")} />
        </div>
      </PolicySection>

      <PolicySection heading={t("section3Heading")}>
        <PolicyText>{t("section3Intro")}</PolicyText>
        <div className="p-4">
          <PolicyBulletList items={t.raw("section3Items")} />
        </div>
      </PolicySection>

      <PolicySection heading={t("section4Heading")}>
        <PolicyText>{t("section4Intro")}</PolicyText>
        <PolicyText>{t("section4Body1")}</PolicyText>
        <PolicyText>{t("section4Body2")}</PolicyText>
      </PolicySection>

      <PolicySection heading={t("section5Heading")}>
        <PolicyText>{t("section5Intro")}</PolicyText>
        <PolicyContactBlock
          name={t("contactName")}
          hotlineLabel={t("contactHotlineLabel")}
          hotlineValue={t("contactHotlineValue")}
          emailLabel={t("contactEmailLabel")}
          emailValue={t("contactEmailValue")}
          addressLabel={t("contactAddressLabel")}
          addressValue={t("contactAddressValue")}
        />
      </PolicySection>
    </PolicyPage>
  );
}
