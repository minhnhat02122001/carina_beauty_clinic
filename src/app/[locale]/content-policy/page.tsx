import { useTranslations } from "next-intl";
import {
  PolicyBulletList,
  PolicyContactBlock,
  PolicyNote,
  PolicyPage,
  PolicySection,
  PolicyText,
} from "@/components/policy-page";
import { ProcessSteps } from "./process-steps";

export default function ContentPolicyPage() {
  const t = useTranslations("ContentPolicy");

  return (
    <PolicyPage heading={t("heading")} intro={t("intro")}>
      <PolicySection heading={t("section1Heading")}>
        <PolicyText>{t("section1Intro")}</PolicyText>
        <div className="p-4">
          <PolicyBulletList items={t.raw("section1Items")} />
        </div>
      </PolicySection>

      <PolicySection heading={t("section2Heading")}>
        <PolicyText>{t("section2Intro")}</PolicyText>
        <ProcessSteps steps={t.raw("section2Items")} />
      </PolicySection>

      <PolicySection heading={t("section3Heading")}>
        <PolicyText>{t("section3Body")}</PolicyText>
      </PolicySection>

      <PolicySection heading={t("section6Heading")}>
        <PolicyText>{t("section6Body1")}</PolicyText>
        <PolicyText>{t("section6Body2")}</PolicyText>
        <PolicyNote>{t("section6Note")}</PolicyNote>
      </PolicySection>

      <PolicySection heading={t("section7Heading")}>
        <PolicyText>{t("section7Body1")}</PolicyText>
        <PolicyText>{t("section7Body2")}</PolicyText>
        <PolicyText>{t("section7Body3")}</PolicyText>
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
