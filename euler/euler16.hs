import System.Environment (getArgs)
import Data.Char

atoi :: Char -> Int
atoi c = ord c - 48 -- 48 is the ascii code for '0'

itoa :: Int -> Char
itoa n = chr (n + 48)

-- Idea is to represent the number as a string to make it arbitrarily large
-- The string is ordered with least-significant digit at the beginning
bigIntAdd :: String -> String -> Int -> String
bigIntAdd "" y 0 = y
bigIntAdd x "" 0 = x
bigIntAdd "" y 1  = bigIntAdd "0" y 1
bigIntAdd x "" 1  = bigIntAdd x "0" 1
bigIntAdd x y carry  = let n1 = atoi (head x)
                           n2 = atoi (head y)
                           s  = n1 + n2 + carry
                           in if s >= 10
                           then itoa (s-10) : bigIntAdd (tail x) (tail y) 1
                           else itoa s      : bigIntAdd (tail x) (tail y) 0

powerOf2Helper :: String -> Int -> String
powerOf2Helper s 0 = s
powerOf2Helper s n = powerOf2Helper (bigIntAdd s s 0) (n-1)

powerOf2 :: Int -> String
powerOf2 n = reverse (powerOf2Helper "1" n)

sumDigits :: String -> Int
sumDigits s = if null s
              then 0
              else atoi (head s) + sumDigits (tail s)

main = do
    args <- getArgs
    let n = read (head args) :: Int
    let res = sumDigits (powerOf2 n)
    print res