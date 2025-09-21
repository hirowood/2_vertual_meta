import { body, param, query, ValidationChain } from 'express-validator';

// ユーザー登録バリデーション
export const validateRegister: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('パスワードは6文字以上で入力してください')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('パスワードは大文字、小文字、数字を含む必要があります'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('名前は2文字以上50文字以下で入力してください'),
];

// ログインバリデーション
export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('パスワードは必須です'),
];

// パスワード変更バリデーション
export const validatePasswordChange: ValidationChain[] = [
  body('currentPassword')
    .notEmpty()
    .withMessage('現在のパスワードは必須です'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('新しいパスワードは6文字以上で入力してください')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('パスワードは大文字、小文字、数字を含む必要があります')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('新しいパスワードは現在のパスワードと異なる必要があります'),
];

// プロフィール更新バリデーション
export const validateProfileUpdate: ValidationChain[] = [
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('自己紹介は500文字以内で入力してください'),
  body('status')
    .optional()
    .isLength({ max: 100 })
    .withMessage('ステータスは100文字以内で入力してください'),
  body('interests')
    .optional()
    .isLength({ max: 200 })
    .withMessage('興味・関心は200文字以内で入力してください'),
  body('grade')
    .optional()
    .isIn(['1年', '2年', '3年', '4年', '5年', '6年', '中1', '中2', '中3', '高1', '高2', '高3'])
    .withMessage('有効な学年を選択してください'),
];

// IDパラメータバリデーション
export const validateIdParam: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('IDは必須です')
    .isString()
    .withMessage('IDは文字列である必要があります'),
];

// ページネーションバリデーション
export const validatePagination: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ページ番号は1以上の整数である必要があります')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('表示件数は1〜100の整数である必要があります')
    .toInt(),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'name'])
    .withMessage('無効なソート項目です'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('ソート順序はascまたはdescである必要があります'),
];
