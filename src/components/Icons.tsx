import {
  FileText,
  Globe,
  Link,
  ArrowRight,
  ArrowLeft,
  Rocket
} from "lucide-react";
import { SiNotion, SiX } from "react-icons/si";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export {
  FaGithub as GitHubIcon,
  SiNotion as NotionIcon,
  FaEnvelope as MailIcon,
  FileText as FileTextIcon,
  Globe as GlobeIcon,
  Link as LinkIcon,
  ArrowRight as ArrowRightIcon,
  ArrowLeft as ArrowLeftIcon,
  SiX as XIcon,
  Rocket as RocketIcon,
};

export function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <FaLinkedin
      {...props}
      style={{
        ...props.style,
        transform: "scale(1.2)",
      }}
    />
  );
}
