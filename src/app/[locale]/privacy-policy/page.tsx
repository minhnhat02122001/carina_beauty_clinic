import { useTranslations } from "next-intl";
import { PolicyBulletList, PolicyContactBlock, PolicyPage, PolicySection, PolicyText } from "@/components/policy-page";

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPolicy");

  return (
    <PolicyPage heading={t("heading")} intro={t("intro")}>
      <PolicySection heading={t("section1Heading")}>
        <PolicyText>{t("section1Intro")}</PolicyText>
        <div className="p-4">
          <PolicyBulletList items={t.raw("section1Items")} />
        </div>
      </PolicySection>

      <PolicySection heading={t("section2Heading")}>
        <div className="p-4">
          <PolicyBulletList items={t.raw("section2Items")} />
        </div>
      </PolicySection>

      <PolicySection heading={t("section3Heading")}>
        <PolicyText>{t("section3Body")}</PolicyText>
      </PolicySection>

      <PolicySection heading={t("section4Heading")}>
        <PolicyText>{t("section4Body")}</PolicyText>
        <PolicyText>{t("section4SubIntro")}</PolicyText>
        <div className="p-4">
          <PolicyBulletList items={t.raw("section4Items")} />
        </div>
      </PolicySection>

      <PolicySection heading={t("section5Heading")}>
        <PolicyText>{t("section5Body")}</PolicyText>
      </PolicySection>

      <PolicySection heading={t("section6Heading")}>
        <PolicyText>{t("section6Intro")}</PolicyText>
        <div className="p-4">
          <PolicyBulletList items={t.raw("section6Items")} />
        </div>
        <PolicyText>{t("section6Closing")}</PolicyText>
      </PolicySection>

      <PolicySection heading={t("section7Heading")}>
        <PolicyText>{t("section7Body")}</PolicyText>
      </PolicySection>

      <PolicySection heading={t("section8Heading")}>
        <PolicyText>{t("section8Intro")}</PolicyText>
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
