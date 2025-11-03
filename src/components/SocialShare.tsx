import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  PinterestShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  PinterestIcon
} from 'react-share';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

export default function SocialShare({ url, title, description, imageUrl }: SocialShareProps) {
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1 text-sm text-slate-600">
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share:</span>
      </div>
      
      <div className="flex gap-2">
        <FacebookShareButton url={url} title={title}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <FacebookIcon size={32} round />
          </motion.div>
        </FacebookShareButton>
        
        <TwitterShareButton url={url} title={title}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <TwitterIcon size={32} round />
          </motion.div>
        </TwitterShareButton>
        
        <WhatsappShareButton url={url} title={title} separator=" - ">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <WhatsappIcon size={32} round />
          </motion.div>
        </WhatsappShareButton>
        
        {imageUrl && (
          <PinterestShareButton url={url} media={imageUrl} description={description || title}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <PinterestIcon size={32} round />
            </motion.div>
          </PinterestShareButton>
        )}
      </div>
    </motion.div>
  );
}
