import System.Environment (getArgs)
import Data.Int (Int32)
import Data.Bits (Bits(xor, shiftL, shiftR))

xorshift :: Int32 -> Int32
xorshift x =
            let s0 = x
                s1 = xor s0 (shiftL s0 13)
                s2 = xor s1 (shiftR s1 17)
                s3 = xor s2 (shiftL s2 5 )
            in s3

callNTimes :: forall a. Int32 -> (a -> a) -> a -> a
callNTimes 0 f arg = arg
callNTimes n f arg = callNTimes (n - 1) f (f arg)

main = do
    args <- getArgs
    let state = read (head args) :: Int32
    let iters = read (args!!1) :: Int32
    let res = callNTimes iters xorshift state
    print res