<?php

namespace App\auth;

use RuntimeException;
use Arbor\auth\authentication\TokenStoreInterface;
use Arbor\auth\authentication\Token;
use App\auth\TokenModel;


class TokenStore implements TokenStoreInterface
{
    public function requireClaims(): array
    {
        return ['user_id', 'exp', 'iat'];
    }


    public function save(Token $token): void
    {
        $model = new TokenModel();

        $model->token_id        = $token->id();
        $model->user_id         = $token->claims('user_id');
        $model->iat             = $token->claims('iat');
        $model->exp             = $token->claims('exp');

        $model->save();
    }


    public function retrieve(Token $token): ?Token
    {
        $model = TokenModel::find($token->id());

        if (!$model) {
            throw new RuntimeException('Token not found');
        }

        if ($model->revoked_at !== null) {
            throw new RuntimeException('Token revoked');
        }

        // mutate & enrich token here.
        $claims = [];
        foreach ($this->requireClaims() as $claim) {
            if (!array_key_exists($claim, $token->claims())) {
                $claims[$claim] = $model->{$claim};
            }
        }

        $mergedClaims = array_merge($token->claims(), $claims);

        // persistence metadata (non-claim)
        $meta = [
            'persisted'  => true,
            'revoked_at' => $model->revoked_at,
        ];

        return $token
            ->withMergedClaims($claims)
            ->withMergedMeta($meta)
            ->withExpiry($mergedClaims['exp']);
    }


    public function validate(Token $token): void
    {
        if ($token->meta('revoked_at') !== null) {
            throw new RuntimeException('Token revoked');
        }
    }


    public function revoke(string $tokenId): void
    {
        $model = TokenModel::find($tokenId);

        if (!$model) {
            return; // idempotent
        }

        if ($model->revoked_at !== null) {
            return;
        }

        $model->revoked_at = date('Y-m-d H:i:s');
        $model->save();
    }
}
