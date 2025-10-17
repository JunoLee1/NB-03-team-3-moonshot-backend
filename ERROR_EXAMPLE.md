```
/*

1. controller 에러 핸들링 하는 레이어, 진짜 기본적인 로직
2. service는 에러를 반환
- try catch를 절대 남발해서는 안됨.. -> 어디서 에러가 생긴지 나중에 찾기가 힘듦... boundary에서만 에러를 잡아서 리턴타입에 추가해서 그냥 값으로 반환해라...
3. routes
*/

type Result<T, R> = SuccessType<T> | ErrorType<R>;

interface SuccessType<T> {
    success: true;
    data: T;
}
interface ErrorType<R> {
    success: false;
    error: R;
}

function exampleFunction(name: string): Result<{name: string;}, string>  {
    try {
        if (name === "John Doe") throw new Error("Name is not allowed");
        return {
            success: true,
            data: {name}
        }
    } catch (error) {
        return {
            success: false,
            error: String(error)
        }
    }
}


const result = exampleFunction("Jane Doe");
if (result.success === true) {
    console.log(result.data);
} else {
    console.log(result.error);
}
```