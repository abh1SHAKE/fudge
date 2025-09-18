import { Router } from 'express';
import { 
    createSweet,
    getAllSweets,
    searchSweets,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet
} from '../controllers/sweetController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllSweets);
router.get('/search', searchSweets);
router.get('/:id/purchase', purchaseSweet);

// Admin only routes
router.post('/', requireAdmin, createSweet);
router.post('/:id', requireAdmin, updateSweet);
router.delete('/:id', requireAdmin, deleteSweet);
router.post('/:id/restock', requireAdmin, restockSweet);

export default router;